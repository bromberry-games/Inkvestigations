import { z } from 'zod';

function imageType() {
	return z
		.custom<File | string | null>((f) => f instanceof File || typeof f === 'string', 'Please upload a file.')
		.refine((f) => (f instanceof File && f.size < 100_000) || typeof f === 'string', 'Max 100 kB upload size.')
		.optional()
		.nullable();
}

const MysterySchema = z.object({
	name: z.string().min(1).max(100),
	image: z
		.custom<File | string | null>((f) => f instanceof File || typeof f === 'string', 'Please upload a file.')
		.refine((f) => (f instanceof File && f.size < 100_000) || typeof f === 'string', 'Max 100 kB upload size.')
		.optional()
		.nullable(),
	description: z.string().max(300).optional(),
	setting: z.string().max(300).optional(),
	theme: z.string().max(300).optional(),
	letter_info: z.string().max(3000).optional(),
	letter_prompt: z.string().max(300).optional(),
	accuse_letter_prompt: z.string().max(300).optional(),
	victim_image: imageType(),
	victim_name: z.string().max(100).optional(),
	victim_description: z.string().max(300).optional(),
	solution: z.string().max(300).optional()
});

const suspectSchema = z.object({
	name: z.string().max(60).optional(),
	description: z.string().max(300).optional(),
	image: z
		.custom<File | string | null>((f) => f instanceof File || typeof f === 'string', 'Please upload a file.')
		.refine((f) => (f instanceof File && f.size < 100_000) || typeof f === 'string', 'Max 100 kB upload size.')
		.optional()
		.nullable()
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
	question: z.string().max(300).optional(),
	answer: z.string().max(300).optional()
});

const GameSuspectSchema = z.object({
	name: z.string().max(60).min(3),
	description: z.string().max(300).min(3),
	image: z
		.custom<File | string | null>((f) => f instanceof File || typeof f === 'string', 'Please upload a file.')
		.refine((f) => (f instanceof File && f.size < 100_000) || typeof f === 'string', 'Max 100 kB upload size.')
		.optional()
		.nullable()
});

const GameActionClueSchema = z.object({
	action: z.string().max(300).min(3),
	clue: z.string().max(300).min(3)
});

const GameTimeframeSchema = z.object({
	timeframe: z.string().max(100).min(3),
	event_happened: z.string().max(300).min(3)
});

const GameFewShotsSchema = z.object({
	question: z.string().max(300).min(3),
	answer: z.string().max(300).min(3)
});

const GameMysterySchema = z.object({
	name: z.string().min(1).max(100),
	image: z
		.custom<File | string | null>((f) => f instanceof File || typeof f === 'string', 'Please upload a file.')
		.refine((f) => (f instanceof File && f.size < 100_000) || typeof f === 'string', 'Max 100 kB upload size.')
		.nullable(),
	description: z.string().max(300).min(3),
	setting: z.string().max(300).min(3),
	theme: z.string().max(300).min(3),
	letter_info: z.string().max(3000).min(3),
	letter_prompt: z.string().max(300).optional(),
	accuse_letter_prompt: z.string().max(300).optional(),
	victim_image: imageType(),
	victim_name: z.string().max(100).min(3),
	victim_description: z.string().max(300).min(3),
	solution: z.string().max(300).min(3)
});

export const submitSchema = z.object({
	id: z.string().min(3).max(100),
	mystery: GameMysterySchema,
	suspects: z.array(GameSuspectSchema).max(7).min(1),
	action_clues: z.array(GameActionClueSchema).max(30).min(1),
	timeframes: z.array(GameTimeframeSchema).max(10).optional(),
	few_shots_known_answers: z.array(GameFewShotsSchema).max(2).min(2),
	few_shots_unknown_answers: z
		.array(z.object({ question: z.string().min(3).max(300), answer: z.string().min(3).max(300) }))
		.max(2)
		.min(2)
});

export type MysterySchema = z.infer<typeof MysterySchema>;
export type MysterySubmitSchema = z.infer<typeof submitSchema>;
// export type MysterySubmitSchema = typeof submitSchema;

export const mainSchema = submitSchema.deepPartial().extend({
	suspects: z.array(suspectSchema).max(7).optional(),
	action_clues: z.array(actionClueSchema).max(30).optional(),
	timeframes: z.array(timeframeSchema).max(10).optional(),
	few_shots_known_answers: z.array(fewShotsSchema).max(2),
	few_shots_unknown_answers: z.array(fewShotsSchema).max(2)
});
