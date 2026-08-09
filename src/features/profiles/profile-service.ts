import { getSupabaseClient } from "@/lib/supabase";

export type PublicProfile = {
	id: string;
	username: string;
	display_name: string;
	bio: string | null;
	avatar_url: string | null;
	website: string | null;
	created_at: string;
};

const publicProfileColumns =
	"id, username, display_name, bio, avatar_url, website, created_at";

export async function getPublicProfile(
	username: string,
): Promise<PublicProfile | null> {
	const { data, error } = await getSupabaseClient()
		.from("profiles")
		.select(publicProfileColumns)
		.eq("username", username)
		.maybeSingle();

	if (error) {
		throw error;
	}

	return data as PublicProfile | null;
}
