import { AuthStatus, getAuthStatus } from '$lib/auth-helper.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate, withFiles } from 'sveltekit-superforms/server';
import { loadyMystery, publishMysteryForAll, saveMystery } from '$lib/supabase/mystery_data.server.js';
import { randomUUID } from 'crypto';
import { zod } from 'sveltekit-superforms/adapters';
import { mainSchema, submitSchema } from './schema';
import { isTAndThrowPostgresErrorIfNot } from '$lib/supabase/helpers';
import type { SupabaseClient } from '@supabase/supabase-js';

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
		return withFiles({ form });
	} else {
		error(404, 'Mystery not found');
	}
};

async function saveForm(form, userId: string) {
	const images: { image: File; path: string }[] = [];
	if (form.data.mystery.image && form.data.mystery.image !== 'image') {
		images.push({ image: form.data.mystery.image, path: 'mystery.image' });
		form.data.mystery.image = 'image';
	}
	for (let i = 0; i < form.data.suspects.length; i++) {
		const suspect = form.data.suspects[i];
		if (suspect.image && suspect.image !== 'image') {
			images.push({ image: suspect.image, path: `suspects${i}.image` });
			suspect.image = 'image';
		}
	}
	const saved = await saveMystery(form.data.id, userId, JSON.stringify(form.data), images);
	isTAndThrowPostgresErrorIfNot(saved);
}

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
		await saveForm(form, session.user.id);
		return message(form, 'Mystery saved');
	},
	submit: async ({ request, locals: { getSession } }) => {
		const [session, form] = await Promise.all([getSession(), superValidate(request, zod(submitSchema))]);
		if (getAuthStatus(session) != AuthStatus.LoggedIn) {
			redirect(303, '/');
		}
		if (!form.valid) {
			console.log('invalid');
			return fail(400, withFiles({ form }));
		}
		await saveForm(form, session.user.id);
		const result = await publishMysteryForAll(form.data, session.user.id);
		isTAndThrowPostgresErrorIfNot(result);
		return message(form, 'Mystery submitted');
	}
};
