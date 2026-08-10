import { getSupabaseClient } from "@/lib/supabase";

export type IdeaValidationOption = {
	id: string;
	value: string;
	label: string;
};

export type IdeaValidationQuestion = {
	id: string;
	prompt: string;
	options: IdeaValidationOption[];
	viewerOptionId: string | null;
};

type IdeaValidationQuestionRow = {
	question_id: string;
	prompt: string;
	option_id: string;
	option_value: string;
	option_label: string;
	sort_order: number;
	viewer_option_id: string | null;
};

export type IdeaValidationEvidence = {
	questionId: string;
	prompt: string;
	totalResponses: number;
	options: Array<IdeaValidationOption & { responseCount: number }>;
};

type IdeaValidationSummaryRow = {
	question_id: string;
	prompt: string;
	option_id: string;
	option_value: string;
	option_label: string;
	response_count: number;
};

function throwIfError(error: unknown): void {
	if (error) {
		throw error;
	}
}

export async function getIdeaValidationQuestion(
	ideaId: string,
): Promise<IdeaValidationQuestion | null> {
	const { data, error } = await getSupabaseClient().rpc(
		"get_idea_validation_question",
		{ target_idea_id: ideaId },
	);

	throwIfError(error);
	const rows = (data ?? []) as IdeaValidationQuestionRow[];
	if (rows.length === 0) {
		return null;
	}

	const [first] = rows;
	return {
		id: first.question_id,
		prompt: first.prompt,
		viewerOptionId: first.viewer_option_id ?? null,
		options: [...rows]
			.sort((left, right) => left.sort_order - right.sort_order)
			.map((row) => ({
				id: row.option_id,
				value: row.option_value,
				label: row.option_label,
			})),
	};
}

export async function getIdeaValidationSummary(
	ideaId: string,
): Promise<IdeaValidationEvidence | null> {
	const { data, error } = await getSupabaseClient().rpc(
		"get_idea_validation_summary",
		{ target_idea_id: ideaId },
	);

	throwIfError(error);
	const rows = (data ?? []) as IdeaValidationSummaryRow[];
	if (rows.length === 0) {
		return null;
	}

	const options = rows.map((row) => ({
		id: row.option_id,
		value: row.option_value,
		label: row.option_label,
		responseCount: Number(row.response_count),
	}));

	return {
		questionId: rows[0].question_id,
		prompt: rows[0].prompt,
		totalResponses: options.reduce(
			(total, option) => total + option.responseCount,
			0,
		),
		options,
	};
}

export async function saveIdeaValidationResponse(
	questionId: string,
	optionId: string,
	profileId: string,
): Promise<void> {
	const { error } = await getSupabaseClient()
		.from("idea_validation_responses")
		.upsert(
			{
				question_id: questionId,
				option_id: optionId,
				profile_id: profileId,
			},
			{ onConflict: "question_id,profile_id" },
		);

	throwIfError(error);
}

export async function removeIdeaValidationResponse(
	questionId: string,
	profileId: string,
): Promise<void> {
	const { error } = await getSupabaseClient()
		.from("idea_validation_responses")
		.delete()
		.eq("question_id", questionId)
		.eq("profile_id", profileId);

	throwIfError(error);
}
