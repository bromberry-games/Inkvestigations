import type { ChatCompletionRequestMessage } from 'openai';
import { writable, type Readable, type Writable, readable, get, derived } from 'svelte/store';
import { persisted } from 'svelte-local-storage-store';
import { v4 as uuidv4 } from 'uuid';
import { EventSource } from './eventSource';
import { ChatStorekeeper } from './chatStorekeeper';
import type { Chat, ChatMessage } from './shared';
import { closeOpenedCodeTicks } from './markdownHelper';


export const liveAnswerStore: Writable<ChatCompletionRequestMessage> = writable({
	role: 'assistant',
	content: ''
});

export const enhancedLiveAnswerStore = derived(liveAnswerStore, ($liveAnswer) => {
	if (!$liveAnswer?.content) {
		return $liveAnswer;
	}

	let { content } = $liveAnswer;
	content = closeOpenedCodeTicks(content);

	return {
		...$liveAnswer,
		content
	} as ChatCompletionRequestMessage;
});

export const isLoadingAnswerStore: Writable<boolean> = writable(false);

export const isTimeagoInitializedStore: Writable<boolean> = writable(false);

export const eventSourceStore: Readable<EventSource> = readable(new EventSource());

/**
 * Custom chat store
 **/

export interface ChatStore extends Writable<{ [key: string]: Chat }> {
	updateChat(slug: string, update: Partial<Chat>): void;
	addMessageToChat(slug: string, message: ChatMessage, parent?: ChatMessage): void;
	deleteMessage(slug: string, id: string): void;
	deleteUpdateToken(slug: string): void;
	deleteChat(slug: string): void;
	getMessageById(messageId: string, chat: Chat): ChatMessage | null;
	selectSibling(slug: string, id: string): void;
	countAllMessages(chat: Chat): number;
	countMessagesInCurrentBranch(chat: Chat): number;
}

const _chatStore: Writable<{ [key: string]: Chat }> = persisted('chatStore', {});

/**
 * Be careful when updating nested objects - they are overwritten, not merged!
 */
const updateChat = (slug: string, update: Partial<Chat>) => {
	_chatStore.update((store) => {
		return { ...store, [slug]: { ...store[slug], ...update } };
	});
};

const addMessageToChat = (slug: string, message: ChatMessage) => {
    if (!message.id) {
        message.id = uuidv4();
    }

    _chatStore.update((store) => {
        const updatedMessages = [...store[slug].messages, message];
        
        ChatStorekeeper.selectSibling(message.id, updatedMessages);
        
        return {
            ...store,
            [slug]: {
                ...store[slug],
                messages: updatedMessages
            }
        };
    });
};

const getCurrentMessage = (chat: Chat, includeContext = true): ChatMessage | null => {
    return ChatStorekeeper.getCurrentMessage(chat, includeContext)[0] || null;
};

const deleteMessage = (slug: string, id: string) => {
    const chat = { ...get(_chatStore)[slug] };
    
    if (!chat) {
        throw new Error('Chat not found');
    }
    
    const index = chat.messages.findIndex((msg) => msg.id === id);
    
    if (index === -1) {
        throw new Error('Message not found in the chat.');
    }
    
    chat.messages.splice(index, 1);
    
    if(chat.messages.length > 0) {
        chat.messages[chat.messages.length - 1].isSelected = true;
    }
    
    _chatStore.update((store) => {
        return {
            ...store,
            [slug]: {
                ...store[slug],
                messages: chat.messages
            }
        };
    });
};


const deleteUpdateToken = (slug: string) => {
	_chatStore.update((store) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { updateToken, ...rest } = store[slug];
		return { ...store, [slug]: rest };
	});
};

const deleteChat = (slug: string) => {
	chatStore.update((store) => {
		const chats = { ...store };
		delete chats[slug];
		return chats;
	});
};

const selectSibling = (slug: string, id: string) => {
	_chatStore.update((store) => {
		const chat = store[slug];
		const found = ChatStorekeeper.selectSibling(id, chat.messages);
		if (!found) {
			throw new Error('Message not found in the chat.');
		}

		return {
			...store,
			[slug]: chat
		};
	});
};

export const chatStore: ChatStore = {
	subscribe: _chatStore.subscribe,
	set: _chatStore.set,
	update: _chatStore.update,
	countAllMessages: ChatStorekeeper.countAllMessages,
	countMessagesInCurrentBranch: ChatStorekeeper.countMessagesInCurrentBranch,
	getMessageById: (messageId, chat) => ChatStorekeeper.getById(messageId, chat.messages),
	updateChat,
	deleteMessage,
	addMessageToChat,
	deleteUpdateToken,
	deleteChat,
	selectSibling
};
