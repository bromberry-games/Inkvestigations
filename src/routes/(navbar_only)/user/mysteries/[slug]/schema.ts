import { z } from 'zod';

const MysterySchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().max(300).optional(),
	setting: z.string().max(300).optional(),
	theme: z.string().max(300).optional(),
	letter_info: z.string().max(300).optional(),
	letter_prompt: z.string().max(300).optional(),
	accuse_letter_prompt: z.string().max(300).optional(),
	victim_name: z.string().max(100).optional(),
	victim_description: z.string().max(300).optional(),
	solution: z.string().max(300).optional()
});

const suspectSchema = z.object({
	name: z.string().max(60).optional(),
	description: z.string().max(300).optional()
});

const actionClueSchema = z.object({
	action: z.string().max(300).optional(),
	clue: z.string().max(300).optional()
});

const timeframeSchema = z.object({
	timeframe: z.string().max(100).optional(),
	event_happened: z.string().max(300).optional()
});

const fewShotsSchema = z.object({
	brain: z.string().max(300).optional(),
	accuse_brain: z.string().max(300).optional()
});

export const mainSchema = z.object({
	id: z.string().min(3).max(100),
	mystery: MysterySchema,
	suspects: z.array(suspectSchema).max(7).optional(),
	action_clues: z.array(actionClueSchema).max(30).optional(),
	timeframes: z.array(timeframeSchema).optional(),
	few_shots: z.array(fewShotsSchema).optional()
});

const GameSuspectSchema = z.object({
	name: z.string().max(60),
	description: z.string().max(300)
});

const GameActionClueSchema = z.object({
	action: z.string().max(300),
	clue: z.string().max(300)
});

const GameTimeframeSchema = z.object({
	timeframe: z.string().max(100),
	event_happened: z.string().max(300)
});

const GameFewShotsSchema = z.object({
	brain: z.string().max(300),
	accuse_brain: z.string().max(300)
});

const GameMysterySchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().max(300),
	setting: z.string().max(300),
	theme: z.string().max(300),
	letter_info: z.string().max(300),
	letter_prompt: z.string().max(300).optional(),
	accuse_letter_prompt: z.string().max(300).optional(),
	victim_name: z.string().max(100),
	victim_description: z.string().max(300),
	solution: z.string().max(300)
});

export const submitSchema = z.object({
	id: z.string().min(3).max(100),
	mystery: GameMysterySchema,
	suspects: z.array(GameSuspectSchema).max(7),
	action_clues: z.array(GameActionClueSchema).max(30),
	timeframes: z.array(GameTimeframeSchema),
	few_shots: z.array(GameFewShotsSchema).optional()
});

export type MysterySubmitSchema = z.infer<typeof submitSchema>;
// export type MysterySubmitSchema = typeof submitSchema;
