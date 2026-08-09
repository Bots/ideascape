import { getSupabaseClient } from "@/lib/supabase";

export type IdeaInterestSummary = {
	interestCount: number;
	viewerHasInterest: boolean;
};

type IdeaInterestSummaryRow = {
	interest_count: number;
	viewer_has_interest: boolean;
};

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
		return { interestCount: 0, viewerHasInterest: false };
	}

	const row = data as IdeaInterestSummaryRow;
	return {
		interestCount: Number(row.interest_count),
		viewerHasInterest: Boolean(row.viewer_has_interest),
	};
}

export async function signalIdeaInterest(
	ideaId: string,
	profileId: string,
): Promise<void> {
	const { error } = await getSupabaseClient().from("idea_interests").upsert(
		{ idea_id: ideaId, profile_id: profileId },
		{
			onConflict: "idea_id,profile_id",
			ignoreDuplicates: true,
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
