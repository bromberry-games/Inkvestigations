import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { chatStore } from '$misc/stores';
import { migrateChat } from '$misc/chatMigration';
export const ssr = false;

export const load: PageLoad = async ({ params, data }) => {
	const { slug } = params;

	const chachedChat = get(chatStore)[slug];


	const { chat: migratedChat, migrated } = data.chat && chachedChat.messages.length < data.chat?.messages.length? migrateChat(data.chat) : migrateChat(chachedChat); 
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
