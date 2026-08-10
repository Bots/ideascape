import { getSupabaseClient } from "@/lib/supabase";

export const participationIntents = [
	"use",
	"build",
	"pilot",
	"expertise",
	"updates",
] as const;

export type ParticipationIntent = (typeof participationIntents)[number];

export type IdeaInterestSummary = {
	interestCount: number;
	viewerHasInterest: boolean;
	viewerIntent: ParticipationIntent | null;
};

type IdeaInterestSummaryRow = {
	interest_count: number;
	viewer_has_interest: boolean;
	viewer_participation_intent: string | null;
};

function isParticipationIntent(value: unknown): value is ParticipationIntent {
	return participationIntents.some((intent) => intent === value);
}

function throwIfError(error: unknown): void {
	if (error) {
		throw error;
	}
}

export async function getIdeaInterestSummary(
	ideaId: string,
): Promise<IdeaInterestSummary> {
	const { data, error } = await getSupabaseClient()
		.rpc("get_idea_interest_summary", { target_idea_id: ideaId })
		.maybeSingle();

	throwIfError(error);
	if (!data) {
		return {
			interestCount: 0,
			viewerHasInterest: false,
			viewerIntent: null,
		};
	}

	const row = data as IdeaInterestSummaryRow;
	return {
		interestCount: Number(row.interest_count),
		viewerHasInterest: Boolean(row.viewer_has_interest),
		viewerIntent: isParticipationIntent(row.viewer_participation_intent)
			? row.viewer_participation_intent
			: null,
	};
}

export async function signalIdeaInterest(
	ideaId: string,
	profileId: string,
	participationIntent: ParticipationIntent,
): Promise<void> {
	const { error } = await getSupabaseClient().from("idea_interests").upsert(
		{
			idea_id: ideaId,
			profile_id: profileId,
			participation_intent: participationIntent,
		},
		{
			onConflict: "idea_id,profile_id",
		},
	);

	throwIfError(error);
}

export async function removeIdeaInterest(
	ideaId: string,
	profileId: string,
): Promise<void> {
	const { error } = await getSupabaseClient()
		.from("idea_interests")
		.delete()
		.eq("idea_id", ideaId)
		.eq("profile_id", profileId);

	throwIfError(error);
}
