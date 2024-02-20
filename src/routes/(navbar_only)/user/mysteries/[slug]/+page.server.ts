import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate, withFiles } from 'sveltekit-superforms/server';
import { loadyMystery, publishMysteryForAll, saveMystery } from '$lib/supabase/mystery_data.server.js';
import { randomUUID } from 'crypto';
import { zod } from 'sveltekit-superforms/adapters';
import { mainSchema, submitSchema } from './schema';
import { isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers';

export const load = async ({ locals: { getSession, supabase }, params }) => {
	const session = await getSession();
	if (getAuthStatus(session) != AuthStatus.LoggedIn) {
		throw redirect(303, '/');
	}
	const slug = params.slug;
	const mystery = await loadyMystery(slug, session.user.id);
	isTAndThrowPostgresErrorIfNot(mystery);
	if (mystery) {
		const form = await superValidate({ ...JSON.parse(mystery.info), id: mystery.id }, zod(mainSchema));
		return { form };
	} else {
		error(404, 'Mystery not found');
	}
};

export const actions = {
	save: async ({ params, request, locals: { getSession } }) => {
		const [session, form] = await Promise.all([getSession(), superValidate(request, zod(mainSchema))]);
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			redirect(303, '/');
		}
		if (!form.valid) {
			return fail(400, { form });
		}
		const { slug } = params;
		const saved = await saveMystery(form.data.id, session.user.id, JSON.stringify(form.data));
		isTAndThrowPostgresErrorIfNot(saved);
		console.log(form.data);
		return withFiles({ form });
	},
	submit: async ({ request, locals: { getSession } }) => {
		const [session, form] = await Promise.all([getSession(), superValidate(request, zod(submitSchema))]);
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			redirect(303, '/');
		}
		console.log('posted');
		if (!form.valid) {
			console.log('invalid');
			return fail(400, { form });
		}
		const saved = await saveMystery(form.data.id, session.user.id, JSON.stringify(form.data));
		isTAndThrowPostgresErrorIfNot(saved);
		const result = await publishMysteryForAll(form.data, session.user.id);
		isTAndThrowPostgresErrorIfNot(result);
		console.log('posted succesfully');
		return withFiles({ form });
	}
};
