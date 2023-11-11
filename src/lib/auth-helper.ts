import type { Session } from '@supabase/supabase-js';

export enum AuthStatus {
	LoggedOut,
	LoggedIn,
	AnonymousLogin
}

export function getAuthStatus(session: Session | null): AuthStatus {
	if (!session) {
		return AuthStatus.LoggedOut;
	} else if (session.user.user_metadata.anonymous == true) {
		return AuthStatus.AnonymousLogin;
	} else {
		return AuthStatus.LoggedIn;
	}
}
