import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai';
import type { RequestHandler } from './$types';
import type { OpenAiSettings } from '$misc/openai';
import { error } from '@sveltejs/kit';
import { defaultOpenAiSettings } from '$misc/openai';
import { getErrorMessage, throwIfUnset } from '$misc/error';
import { OPEN_AI_KEY } from '$env/static/private';
import { archiveLastConversation, decreaseMessageForUser, getAccusePrompt, getMessageAmountForUser } from '$lib/supabase_full.server';
import { ChatMode } from '$misc/shared';
import Chat from '$lib/gpt/Chat.svelte';
import { Transform } from 'stream';


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
		console.log("messages: ")
		console.log(completionOpts.messages);
		const apiUrl = 'https://api.openai.com/v1/chat/completions';
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${openAiKey}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(completionOpts)
		});

		let processedReadableController: ReadableStreamDefaultController;

        const processedReadableStream = new ReadableStream<Uint8Array>({
            start(controller) {
                processedReadableController = controller;
            }
        });

        const writer = new WritableStream({
            write(chunk) {
                // Process the chunk if needed
                // For this example, directly enqueuing it to the readable stream
				console.log("proccessing chink")
				console.log(chunk);
                processedReadableController.enqueue(chunk);
            },
            close() {
                processedReadableController.close();
            },
            abort(err) {
                processedReadableController.error(err);
            }
        });

        response.body?.pipeTo(writer).catch(err => {
            processedReadableController.error(err);
        });


        await decreaseMessageForUser(session.user.id);

        return new Response(processedReadableStream, {
            headers: {
                'Content-Type': 'text/event-stream'
            }
        });

	} catch (err) {
		throw error(500, getErrorMessage(err));
	}
};
