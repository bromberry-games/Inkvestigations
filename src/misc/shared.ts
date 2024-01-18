export interface ChatMessage {
	isAborted?: boolean;
	content: string;
	role: 'user' | 'assistant' | 'system';
}
