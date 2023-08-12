import { redirect } from '@sveltejs/kit'

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next')

  url.searchParams.forEach((value, name) => {
    console.log(`${name}: ${value}`);
  });

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  if (next) {
    throw redirect(303, next)
  }


  throw redirect(303, '/')
}