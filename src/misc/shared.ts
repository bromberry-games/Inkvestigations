import type { ChatCompletionRequestMessage } from 'openai';

export interface ChatMessage extends ChatCompletionRequestMessage {
	id?: string;
	isSelected?: boolean;
	isAborted?: boolean;
}
