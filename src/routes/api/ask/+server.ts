import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai';
import type { RequestHandler } from './$types';
import type { OpenAiSettings } from '$misc/openai';
import { error } from '@sveltejs/kit';
import { defaultOpenAiSettings } from '$misc/openai';
import { getErrorMessage, throwIfUnset } from '$misc/error';
import { OPEN_AI_KEY } from '$env/static/private';
import { decreaseMessageForUser, getMessageAmountForUser } from '$lib/supabase_full.server';
import { ChatMode } from '$misc/shared';
import Chat from '$lib/gpt/Chat.svelte';

const openAiKey : string = OPEN_AI_KEY;


const ratingMessages: ChatCompletionRequestMessage[] = [
	{
		role: 'user',
		content: `
			## Game information
			The theme of this game is: pride and shame. All information that you make up should reflect these one way or another.
			Wellington only knows the following at the beginning of the game:
			"Michael Terry who regularly dragged people's name through the mud, was found dead, thrown through the mirror in his study. His maid called the police, but before we had arrived, the politician Dexter Tin was there. He was supposed to have a meeting with Terry. Three days prior, Terry held a party at his house, but between then and his death he should have been alone until his appointment with Mr. Tin. There is no sign of struggle or forced entry, but a suicide is unlikely because the method is so gruesome and strange." 
			### Time Frame
			Friday evening: party with his friends
			Saturday morning: guests who stayed over leave his house early in the morning. Terry recovers from his hangover. 
			Sunday: Terry is alone writing
			Monday: Terry is found dead around noon by the maid. Dexter Tin arrives.
			___
			## Characters
			#### Michael Terry
			Victim. Reputation as a rockstar journalist, but rumored to not always follow the truth, or at least embellish a little. Recently he privately started writing fiction without anybody knowing. 
			#### Bianca White
			Best friend who always gets the first draft, also wanted to be a journalist. Works in marketing now. [Acts like Cersei Lannister]
			#### Dexter Tin
			Politician disgraced by Terry. [Acts like Samuel L. Jackson]
			#### Oliver Smith
			Biggest fan before becoming his apprentice. Extremely strong drive for journalistic ethics and professionalism [Acts like Captain America]
			#### Maria 
			Long-time maid. [Acts like Sofia Vergara]

			---
			## Actions and clues
			- Searching the rooms yields these clues: a bottle of medication for hair-regrowth; a trash can full of discarded drafts; a half-written piece on uncovering the dealings of a mafia boss; letters shaping that Tin was not involved in the conspiracy Terry published; Terry's desk with everything he needs to write and his favorite ink pen; a drawer full of fan letters; fingerprints of all people close to him;
			- inspecting the half-written piece: it is an expose, but none of the names are known in the country;
			- inspecting the Tin letters: they just show his innocence from an objective observer, but have his fingerprints all over them;
			- inspecting fan letters: different fans praising him for different things. A lot are from Oliver from when he was still a fan. The recent ones have the distinct smudge Terry's pen leaves when writing, as if he wrote some himself
			- asking about the similarity of Oliver's letters and Terry's drafts: they are using the same pen; 
			- autopsy: he was poisoned with cyanide; in his stomach a pill was found; he had a blue tongue, probably from his famous habit of licking his pen, he probably fell through the mirror after dying;
			- analyzing pills: all ordinary;
			- analyzing pen: gelatin and traces of cyanide in the inkwell;
			- asking about the gelatin: it is common for pills to be encased in gelatin, but this is much more than a normal pill, it would have taken a lot longer to dissolve;
			- asking how often Terry refilled the inkwell: with his writing speed every two days probably;
			- alleged alibis: Bianca was on a trip, but talked to Terry over the phone; Tin was busy with his political obligations; Oliver was at home writing a piece;
			- searching Oliver's apartment: a normal apartment, but for the fact that he has the same pen as Terry twice
			- analyzing Oliver's pens: one is regular, the other has the same traces as the one in Terry's apartment
			"

			The previous text was all information to a mystery game. Now I want you to wait for me to provide the correct information on the motive, opportunity, and evidence to solve this case. Rate my performance based on the correctness from 1-5 stars. If I am wrong, give 0 stars. Also, do not say who is more likely to have been the perpetrator! Always write an epilogue of how the accusation went based on the stars rating. Make it no longer than 100 words. Always rate if there is nothing given, rate it badly.	
		`
	},
	{
		role: 'assistant',
		content: 'I\'m ready to evaluate the information you provide regarding the motive, opportunity, and evidence to solve the case. Once you have the information ready, feel free to share it and I will provide the rating and epilogue accordingly.'
	}
]


function createChatCompletionRequest(chatMode: ChatMode, messages: ChatCompletionRequestMessage[]): CreateChatCompletionRequest {
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
				messages:[...ratingMessages, messages[messages.length - 1]],
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

		const settings = defaultOpenAiSettings;


		//const completionOpts: CreateChatCompletionRequest = {
		//	...settings,
		//	messages,
		//	stream: true
		//};
		const completionOpts = createChatCompletionRequest(game_config.mode, messages);

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

		await decreaseMessageForUser(session.user.id);

		return new Response(response.body, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		});

	} catch (err) {
		throw error(500, getErrorMessage(err));
	}
};
