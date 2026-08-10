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
	threat_scenario: string | null;
	control_boundary: string | null;
	proof_required: string | null;
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

const legacySummaryColumns = `
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

const summaryColumns = `
	${legacySummaryColumns},
	threat_scenario,
	control_boundary,
	proof_required
`;

const legacyDetailColumns = `
	${legacySummaryColumns},
	description
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

function isMissingSecurityColumnError(error: unknown): boolean {
	if (!error || typeof error !== "object") {
		return false;
	}

	const { code, message } = error as { code?: unknown; message?: unknown };
	return (
		(code === "42703" || code === "PGRST204") &&
		typeof message === "string" &&
		/(?:threat_scenario|control_boundary|proof_required)/.test(message)
	);
}

export async function listPublishedIdeas(): Promise<PublishedIdeaSummary[]> {
	const client = getSupabaseClient();
	const initialResult = await client
		.from("ideas")
		.select(summaryColumns)
		.neq("status", "draft")
		.order("published_at", { ascending: false, nullsFirst: false });
	let data: unknown = initialResult.data;
	let error: unknown = initialResult.error;
	if (isMissingSecurityColumnError(error)) {
		const fallbackResult = await client
			.from("ideas")
			.select(legacySummaryColumns)
			.neq("status", "draft")
			.order("published_at", { ascending: false, nullsFirst: false });
		data = fallbackResult.data;
		error = fallbackResult.error;
	}

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
		threat_scenario: idea.threat_scenario ?? null,
		control_boundary: idea.control_boundary ?? null,
		proof_required: idea.proof_required ?? null,
		interestCount: countByIdeaId.get(idea.id) ?? 0,
		media: [...(idea.media ?? [])].sort(
			(left, right) => left.sort_order - right.sort_order,
		),
	}));
}

export async function getPublishedIdea(
	slug: string,
): Promise<PublishedIdeaDetail | null> {
	const client = getSupabaseClient();
	const initialResult = await client
		.from("ideas")
		.select(detailColumns)
		.eq("slug", slug)
		.neq("status", "draft")
		.maybeSingle();
	let data: unknown = initialResult.data;
	let error: unknown = initialResult.error;
	if (isMissingSecurityColumnError(error)) {
		const fallbackResult = await client
			.from("ideas")
			.select(legacyDetailColumns)
			.eq("slug", slug)
			.neq("status", "draft")
			.maybeSingle();
		data = fallbackResult.data;
		error = fallbackResult.error;
	}

	throwIfError(error);
	if (!data) {
		return null;
	}

	const idea = data as unknown as PublishedIdeaDetail;
	return {
		...idea,
		threat_scenario: idea.threat_scenario ?? null,
		control_boundary: idea.control_boundary ?? null,
		proof_required: idea.proof_required ?? null,
		media: [...(idea.media ?? [])].sort(
			(left, right) => left.sort_order - right.sort_order,
		),
	};
}
