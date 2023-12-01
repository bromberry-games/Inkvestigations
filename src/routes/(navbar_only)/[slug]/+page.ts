import type { PageLoad } from './$types';
//export const ssr = false;

export const load: PageLoad = async ({ params, data }) => {
	const { slug } = params;

	//chatStore.updateChat(slug, data.chat);
	////TODO check this out
	//const { chat: migratedChat, migrated } = migrateChat(data.chat);
	//if (migrated) {
	//	chatStore.updateChat(slug, migratedChat);
	//	console.log(`migrated chat: ${slug}`);
	//}
	return {
		slug,
		messages: data.messages,
		suspects: data.suspects
	};
};
