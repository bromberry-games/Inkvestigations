//import { ChatCompletion } from 'openai';
//
//export interface ChatMessage extends ChatCompletionMessage {
//	isAborted?: boolean;
//}

export interface ChatMessage {
	isAborted?: boolean;
	content: string;
	role: 'user' | 'assistant' | 'system';
}
