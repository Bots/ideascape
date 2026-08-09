import { getSupabaseClient } from "@/lib/supabase";

export type AuthCredentials = {
	email: string;
	password: string;
};

export type OAuthProvider = "github" | "google";

export async function signInWithEmail(
	credentials: AuthCredentials,
): Promise<void> {
	const { error } =
		await getSupabaseClient().auth.signInWithPassword(credentials);

	if (error) {
		throw error;
	}
}

export async function signUpWithEmail(
	credentials: AuthCredentials,
): Promise<{ hasSession: boolean }> {
	const { data, error } = await getSupabaseClient().auth.signUp({
		...credentials,
		options: {
			emailRedirectTo: `${window.location.origin}/auth/callback`,
		},
	});

	if (error) {
		throw error;
	}

	return { hasSession: data.session !== null };
}

export async function signInWithOAuth(provider: OAuthProvider): Promise<void> {
	const { error } = await getSupabaseClient().auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: `${window.location.origin}/auth/callback`,
		},
	});

	if (error) {
		throw error;
	}
}

export async function signOut(): Promise<void> {
	const { error } = await getSupabaseClient().auth.signOut({ scope: "local" });

	if (error) {
		throw error;
	}
}
