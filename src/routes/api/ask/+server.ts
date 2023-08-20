import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai';
import type { RequestHandler } from './$types';
import type { OpenAiSettings } from '$misc/openai';
import { error } from '@sveltejs/kit';
import { defaultOpenAiSettings } from '$misc/openai';
import { getErrorMessage, throwIfUnset } from '$misc/error';
import { OPEN_AI_KEY } from '$env/static/private';
import { decreaseMessageForUser, getMessageAmountForUser } from '$lib/supabase';

const openAiKey : string = OPEN_AI_KEY;

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

		const settings = defaultOpenAiSettings;
		const completionOpts: CreateChatCompletionRequest = {
			...settings,
			messages,
			stream: true
		};

		const apiUrl = 'https://api.openai.com/v1/chat/completions';

		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${openAiKey}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(completionOpts)
		});

		if (!response.ok) {
			const err = await response.json();
			throw err.error;
		}

		console.log("decreasing in api route")
		decreaseMessageForUser(session.user.id);
		console.log("Should have decreased")

		return new Response(response.body, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		});

	} catch (err) {
		throw error(500, getErrorMessage(err));
	}
};
