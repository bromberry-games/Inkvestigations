import type { Chat, ChatMessage } from './shared';
import { v4 as uuidv4 } from 'uuid';

function hasMissingId(messages: ChatMessage[]): boolean {
    return messages.some(message => !message.id);
}

function assignMessageId(messages: ChatMessage[]): void {
    for (const msg of messages) {
        if (!msg.id) msg.id = uuidv4();
    }
}

function assignMessageIds(chat: Chat): void {
    assignMessageId(chat.messages);
}

function needsMigration(chat: Chat): boolean {
    return hasMissingId(chat.messages);
}

export function migrateChat(chat: Chat): { chat: Chat; migrated: boolean } {
    if (!needsMigration(chat)) {
        return { chat, migrated: false };
    }
    const migratedChat = { ...chat };
    assignMessageIds(migratedChat);

    return { chat: migratedChat, migrated: true };
}
