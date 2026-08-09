import { getSupabaseClient } from "@/lib/supabase";

export type PublishedIdeaStatus =
	| "published"
	| "funding"
	| "funded"
	| "in_progress"
	| "completed"
	| "cancelled";

export type IdeaCreatorSummary = {
	id: string;
	username: string;
	display_name: string;
	avatar_url: string | null;
};

export type IdeaCategorySummary = {
	id: number;
	slug: string;
	name: string;
};

export type PublishedIdeaSummary = {
	id: string;
	slug: string;
	title: string;
	summary: string;
	status: PublishedIdeaStatus;
	published_at: string | null;
	created_at: string;
	category: IdeaCategorySummary | null;
	creator: IdeaCreatorSummary;
};

export type IdeaMedia = {
	id: string;
	kind: "image" | "video";
	url: string;
	alt_text: string | null;
	sort_order: number;
};

export type PublishedIdeaDetail = PublishedIdeaSummary & {
	description: string;
	media: IdeaMedia[];
};

const summaryColumns = `
	id,
	slug,
	title,
	summary,
	status,
	published_at,
	created_at,
	category:categories(id, slug, name),
	creator:profiles!ideas_creator_id_fkey(id, username, display_name, avatar_url)
`;

const detailColumns = `
	${summaryColumns},
	description,
	media:idea_media(id, kind, url, alt_text, sort_order)
`;

function throwIfError(error: unknown): void {
	if (error) {
		throw error;
	}
}

export async function listPublishedIdeas(): Promise<PublishedIdeaSummary[]> {
	const { data, error } = await getSupabaseClient()
		.from("ideas")
		.select(summaryColumns)
		.neq("status", "draft")
		.order("published_at", { ascending: false, nullsFirst: false });

	throwIfError(error);
	return (data ?? []) as unknown as PublishedIdeaSummary[];
}

export async function getPublishedIdea(
	slug: string,
): Promise<PublishedIdeaDetail | null> {
	const { data, error } = await getSupabaseClient()
		.from("ideas")
		.select(detailColumns)
		.eq("slug", slug)
		.neq("status", "draft")
		.maybeSingle();

	throwIfError(error);
	if (!data) {
		return null;
	}

	const idea = data as unknown as PublishedIdeaDetail;
	return {
		...idea,
		media: [...(idea.media ?? [])].sort(
			(left, right) => left.sort_order - right.sort_order,
		),
	};
}
