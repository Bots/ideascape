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

type PublishedIdeaBase = {
	id: string;
	slug: string;
	title: string;
	summary: string;
	status: PublishedIdeaStatus;
	published_at: string | null;
	created_at: string;
	category: IdeaCategorySummary | null;
	creator: IdeaCreatorSummary;
	media: IdeaMedia[];
};

export type PublishedIdeaSummary = PublishedIdeaBase & {
	interestCount: number;
};

export type IdeaMedia = {
	id: string;
	kind: "image" | "video";
	url: string;
	alt_text: string | null;
	sort_order: number;
};

export type PublishedIdeaDetail = PublishedIdeaBase & {
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
	creator:profiles!ideas_creator_id_fkey(id, username, display_name, avatar_url),
	media:idea_media(id, kind, url, alt_text, sort_order)
`;

const detailColumns = `
	${summaryColumns},
	description
`;

function throwIfError(error: unknown): void {
	if (error) {
		throw error;
	}
}

export async function listPublishedIdeas(): Promise<PublishedIdeaSummary[]> {
	const client = getSupabaseClient();
	const { data, error } = await client
		.from("ideas")
		.select(summaryColumns)
		.neq("status", "draft")
		.order("published_at", { ascending: false, nullsFirst: false });

	throwIfError(error);
	const ideas = (data ?? []) as unknown as PublishedIdeaBase[];
	if (ideas.length === 0) {
		return [];
	}

	const { data: interestCounts, error: interestError } = await client.rpc(
		"get_idea_interest_counts",
		{ target_idea_ids: ideas.map((idea) => idea.id) },
	);
	throwIfError(interestError);
	const countByIdeaId = new Map<string, number>(
		(
			(interestCounts ?? []) as { idea_id: string; interest_count: number }[]
		).map((row) => [row.idea_id, row.interest_count]),
	);

	return ideas.map((idea) => ({
		...idea,
		interestCount: countByIdeaId.get(idea.id) ?? 0,
		media: [...(idea.media ?? [])].sort(
			(left, right) => left.sort_order - right.sort_order,
		),
	}));
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
