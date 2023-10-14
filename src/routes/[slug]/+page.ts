import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { chatStore } from '$misc/stores';
import { migrateChat } from '$misc/chatMigration';
//export const ssr = false;

export const load: PageLoad = async ({ params, data }) => {
	const { slug } = params;

	chatStore.updateChat(slug, data.chat);
	//TODO check this out
	const { chat: migratedChat, migrated } = migrateChat(data.chat); 
	if (migrated) {
		chatStore.updateChat(slug, migratedChat);
		console.log(`migrated chat: ${slug}`);
	}
	return {
		slug,
		suspects: data.suspects
	};
};