import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai';
import type { RequestHandler } from './$types';
import type { OpenAiSettings } from '$misc/openai';
import { error, json } from '@sveltejs/kit';
import { defaultOpenAiSettings } from '$misc/openai';
import { getErrorMessage, throwIfUnset } from '$misc/error';
import { OPEN_AI_KEY } from '$env/static/private';
import { addMessageForUser, archiveLastConversation, decreaseMessageForUser, getAccusePrompt, getMessageAmountForUser, setRating } from '$lib/supabase_full.server';
import { ChatMode } from '$misc/shared';
import { createParser } from 'eventsource-parser';


const openAiKey : string = OPEN_AI_KEY;

function createChatCompletionRequest(chatMode: ChatMode, messages: ChatCompletionRequestMessage[], suspectToAccuse: string, ratingPrompt: string): CreateChatCompletionRequest {
	switch(chatMode) {
		case ChatMode.Chat: {
			return {
				...defaultOpenAiSettings,
				messages,
				stream: true
			}
		}
		case ChatMode.Accuse: {
			return {
				...defaultOpenAiSettings,
				messages: [
					{
						role: 'user',
						content: ratingPrompt + "\n" + "The murderer is: " + suspectToAccuse + "\n" + messages[messages.length - 1].content
					}
				],
				stream: true
			}	
		}
	}

}

export const POST: RequestHandler = async ({ request, fetch, locals: {getSession, supabase} }) => {
	const session = await getSession();
	if (!session) {
		throw error(500, 'You are not logged in.');
	}
	if (await getMessageAmountForUser(session.user.id) <= 0) {
		throw error(500, 'You have no messages.');
	}
	try {
		const requestData = await request.json();
		throwIfUnset('request data', requestData);
		const messages: ChatCompletionRequestMessage[] = requestData.messages;
		throwIfUnset('messages', messages);
		const game_config = requestData.game_config;
		throwIfUnset('game_config', game_config);
		const suspectToAccuse = game_config.suspectToAccuse;
		throwIfUnset('Mystery name', game_config.mysteryName);

		const chatMode = suspectToAccuse ? ChatMode.Accuse : ChatMode.Chat;
		if(chatMode == ChatMode.Accuse) {
			await archiveLastConversation(session.user.id, game_config.mysteryName);
		}

		const ratingPrompt = await getAccusePrompt(game_config.mysteryName);
		if(!ratingPrompt) {
			throw error(500, 'Could not get rating prompt');
		}
		const completionOpts = createChatCompletionRequest(chatMode, messages, suspectToAccuse, ratingPrompt);
		const apiUrl = 'https://api.openai.com/v1/chat/completions';
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${openAiKey}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(completionOpts)
		});

	    await decreaseMessageForUser(session.user.id);

	  	if (!response.ok) {
	        const err = await response.json();
	        throw err.error;
	    }

	    const decoder = new TextDecoder();
		const encoder = new TextEncoder();

		let accuseParsed = false;

		const processedStream = new ReadableStream({
		    async start(controller) {
		        const parser = createParser(onParse);

				let message = '';
				function onParse(event) {
				    if (event.type === 'event') {
				        if (event.data !== "[DONE]") {
				            const content = JSON.parse(event.data).choices[0].delta?.content || "";
				            if (chatMode == ChatMode.Accuse && !accuseParsed) {
				                if(/Rating:\s*\d+[\s\S]*?Epilogue:\s*\w/i.test(message)) {
				                    const ratingRegex=/Rating:\s?(\d+)/;
									const ratingMatch = message.match(ratingRegex);
									if(!ratingMatch) {
										throw error(500, 'Could not parse rating');
									}
				                    const rating = ratingMatch[1];
				                    message = message.replace(ratingRegex, '').replace(/Epilogue:\s?/,'');
									console.log("message to inser: " + message);
									const newData = "data: " + JSON.stringify({content: message}) + "\n\n";
									console.log(newData)
				                    controller.enqueue(encoder.encode(newData));
				                    setRating(game_config.mysteryName, session.user.id, parseInt(rating));
				                    accuseParsed = true;
				                } else {
				                    message += content;
				                    console.log("current message ist: " + message);
				                }
				            } else {
				                message += content;
				                const newData = "data: " + JSON.stringify({content: content}) + "\n\n";
				                controller.enqueue(encoder.encode(newData));
				            }
				        } else {
				            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
				            addMessageForUser(session.user.id, message, game_config.mysteryName);
				            console.log("message from backend: " + message);
				            controller.close();
				        }
				    } else if (event.type === 'reconnect-interval') {
				        console.warn('We should set reconnect interval to %d milliseconds', event.value);
				    }
				}

				if(response.body == null) {
					throw error(500, 'No response from OpenAI');
				}
			
		        for await (const value of response.body.pipeThrough(new TextDecoderStream())) {
		            parser.feed(value);
					console.log(value)
		        }
		    }
		});



		addMessageForUser(session.user.id, messages[messages.length - 1].content, game_config.mysteryName);
		
	    return new Response(processedStream, {
	        headers: {
	            'Content-Type': 'text/event-stream'
	        }
	    });

	} catch (err) {
		throw error(500, getErrorMessage(err));
	}
};
