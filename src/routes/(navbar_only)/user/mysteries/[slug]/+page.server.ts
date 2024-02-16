import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
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
	const mysteyrName = params.slug.replace(/_/g, ' ');
	const mystery = await loadyMystery(mysteyrName, session.user.id);
	if (mystery === null) {
		throw error(500, 'Error loading mystery');
	}
	console.log(mystery);
	if (mystery.info != '') {
		const form = await superValidate({ ...JSON.parse(mystery.info), id: mystery.id }, zod(mainSchema));
		return { form };
	}
	const form = await superValidate({ id: randomUUID() }, zod(mainSchema));
	return { form };
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
		await saveMystery(form.data.id, form.data.name, session.user.id, JSON.stringify(form.data));
		if (form.data.name.replace(/ /g, '_') != slug) {
			throw redirect(303, `/user/mysteries/${form.data.name.replace(/ /g, '_')}`);
		}
		return { form };
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
		// const saved = await saveMystery(form.data.id, form.data.mystery.name, session.user.id, JSON.stringify(form.data));
		const result = await publishMysteryForAll(form.data);
		isTAndThrowPostgresErrorIfNot(result);
		console.log('posted succesfully');
		return { form };
	}
};
