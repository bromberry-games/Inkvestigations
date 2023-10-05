import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { chatStore } from '$misc/stores';
import { migrateChat } from '$misc/chatMigration';
export const ssr = false;

export const load: PageLoad = async ({ params, data }) => {
	const { slug } = params;

	const cachedChat = get(chatStore)[slug];


	console.log("chat form load: ")
	console.log(data.chat)
	const { chat: migratedChat, migrated } = !cachedChat || data.chat && cachedChat.messages.length < data.chat?.messages.length? migrateChat(data.chat) : migrateChat(cachedChat); 
	//const chat = get(chatStore)[slug];
	//const { chat: migratedChat, migrated } = migrateChat(chat);

	if (migrated) {
		chatStore.updateChat(slug, migratedChat);
		console.log(`migrated chat: ${slug}`);
	}

	return {
		slug,
	};
};
