export const MAX_WRITE_TOKENS = 60;
export const MAX_ACCUSE_TOKENS = 180;
export const MAX_CONVERSATION_LENGTH = 50;

export function textIsTooLong(accuseMode: boolean, messageTokens: number) {
	return (!accuseMode && messageTokens > MAX_WRITE_TOKENS) || (accuseMode && messageTokens > MAX_ACCUSE_TOKENS);
}
