import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { loadyMystery, saveMystery } from '$lib/supabase/mystery_data.server.js';
import { randomUUID } from 'crypto';

const mainSchema = z.object({
	id: z.string().min(3).max(100),
	name: z.string().min(3).max(100),
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
	id: z.string().min(3).max(100),
	name: z.string().min(3).max(100),
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

export const load = async ({ locals: { getSession, supabase }, params }) => {
	const session = await getSession();
	if (getAuthStatus(session) != AuthStatus.LoggedIn) {
		throw redirect(303, '/');
	}
	const mysteyrName = params.slug.replace(/_/g, ' ');
	const mystery = await loadyMystery(mysteyrName, session.user.id);
	if (mystery === null) {
		throw error(500, 'Error loading mystery');
	}
	console.log(mystery);
	if (mystery.info != '') {
		const form = await superValidate({ ...JSON.parse(mystery.info), id: mystery.id }, mainSchema);
		return { form };
	}
	const form = await superValidate({ id: randomUUID() }, mainSchema);
	return { form };
};

export const actions = {
	save: async ({ params, request, locals: { getSession } }) => {
		const [session, form] = await Promise.all([getSession(), superValidate(request, mainSchema)]);
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			throw redirect(303, '/');
		}
		if (!form.valid) {
			return fail(400, { form });
		}
		const { slug } = params;
		await saveMystery(form.data.id, form.data.name, session.user.id, JSON.stringify(form.data));
		if (form.data.name.replace(/ /g, '_') != slug) {
			throw redirect(303, `/user/mysteries/${form.data.name.replace(/ /g, '_')}`);
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
