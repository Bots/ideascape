import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPublicEnv } from "@/lib/env";

let client: SupabaseClient | undefined;

export function getSupabaseClient(): SupabaseClient {
	if (!client) {
		const env = getPublicEnv();
		client = createClient(
			env.VITE_SUPABASE_URL,
			env.VITE_SUPABASE_PUBLISHABLE_KEY,
		);
	}

	return client;
}
