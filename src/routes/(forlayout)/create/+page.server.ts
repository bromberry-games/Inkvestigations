import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

const mainSchema = z.object({
	setting: z.string().max(300).optional(),
	suspects: z
		.object({
			name: z.string().max(100).optional(),
			description: z.string().max(300).optional()
		})
		.array()
		.max(7)
		.optional(),
	events: z
		.object({
			time: z.string().max(100).optional(),
			description: z.string().max(300).optional()
		})
		.array()
		.max(7)
		.optional(),
	inspectorActions: z
		.object({
			action: z.string().max(200).optional(),
			outcome: z.string().max(200).optional()
		})
		.array()
		.max(30)
		.optional(),
	murdererName: z.string().max(100).optional(),
	murdererDescription: z.string().max(300).optional(),
	murdererReason: z.string().max(300).optional()
});

const submitSchema = z.object({
	setting: z.string().min(3).max(300),
	suspects: z
		.object({
			name: z.string().min(1).max(100),
			description: z.string().min(1).max(300)
		})
		.array()
		.min(1)
		.max(7),
	events: z
		.object({
			time: z.string().min(1).max(100),
			description: z.string().min(1).max(300)
		})
		.array()
		.min(1)
		.max(7),
	inspectorActions: z
		.object({
			action: z.string().min(1).max(200),
			outcome: z.string().min(1).max(200)
		})
		.array()
		.max(30),
	murdererName: z.string().min(1).max(100),
	murdererDescription: z.string().min(1).max(300),
	murdererReason: z.string().min(1).max(300)
});

export const load = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();
	if (getAuthStatus(session) != AuthStatus.LoggedIn) {
		throw redirect(303, '/');
	}

	const form = await superValidate(mainSchema);
	return { form };
};

export const actions = {
	save: async ({ request }) => {
		const form = await superValidate(request, mainSchema);
		console.log('POST', form);
		console.log(form.data.suspects);

		if (!form.valid) {
			return fail(400, { form });
		}

		return { form };
	},
	submit: async ({ request }) => {
		const form = await superValidate(request, submitSchema);
		console.log('POST', form);
		if (!form.valid) {
			return fail(400, { form });
		}
		return { form };
	}
};
