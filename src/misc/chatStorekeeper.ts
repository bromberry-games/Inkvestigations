import type { Chat, ChatMessage } from './shared';

/**
 * This class is just used to move some lengthy logic out of the stores file.
 * Contains only static functions and does not temper with the Svelte store.
 */

//TODO check this code it is from GPT-4
export class ChatStorekeeper {
    static getById(messageId: string, chatMessages: ChatMessage[]): ChatMessage | null {
        return chatMessages.find(message => message.id === messageId) || null;
    }

    static addMessage(chatMessages: ChatMessage[], messageToAdd: ChatMessage): ChatMessage[] {
        return [...chatMessages, messageToAdd];
    }

    static getCurrentMessage(chat: Chat, includeContext = true): ChatMessage[] {
        const result: ChatMessage[] = 
            includeContext && chat.contextMessage.content ? [chat.contextMessage] : [];
        
        const selectedMessage = chat.messages.find(message => message.isSelected);
        if(selectedMessage) result.push(selectedMessage);
        
        return result;
    }

    static selectSibling(id: string, messages: ChatMessage[]): boolean {
        let found = false;
        for (const message of messages) {
            if(message.id === id) {
                message.isSelected = true;
                found = true;
            } else {
                message.isSelected = false;
            }
        }
        return found;
    }

    static countAllMessages(chat: Chat): number {
        return chat.messages.length;
    }

    static countMessagesInCurrentBranch(chat: Chat): number {
        return chat.messages.some(message => message.isSelected) ? 1 : 0;
    }
}
