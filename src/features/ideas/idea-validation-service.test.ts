import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	getIdeaValidationQuestion,
	getIdeaValidationSummary,
	removeIdeaValidationResponse,
	saveIdeaValidationResponse,
} from "@/features/ideas/idea-validation-service";
import { getSupabaseClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
	getSupabaseClient: vi.fn(),
}));

const rpc = vi.fn();
const upsert = vi.fn();
const deleteProfileEq = vi.fn();
const deleteQuestionEq = vi.fn(() => ({ eq: deleteProfileEq }));
const remove = vi.fn(() => ({ eq: deleteQuestionEq }));
const from = vi.fn(() => ({ upsert, delete: remove }));

const ideaId = "00000000-0000-4000-8000-000000000218";
const questionId = "00000000-0000-4000-8000-000000000401";
const optionId = "00000000-0000-4000-8000-000000000411";
const profileId = "55555555-5555-4555-8555-555555555555";

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(getSupabaseClient).mockReturnValue({
		rpc,
		from,
	} as unknown as ReturnType<typeof getSupabaseClient>);
	rpc.mockResolvedValue({
		data: [
			{
				question_id: questionId,
				prompt: "What could you bring to a first Project Time Capsule pilot?",
				option_id: optionId,
				option_value: "open-source-project",
				option_label: "An open-source project I maintain",
				sort_order: 0,
				viewer_option_id: optionId,
			},
			{
				question_id: questionId,
				prompt: "What could you bring to a first Project Time Capsule pilot?",
				option_id: "00000000-0000-4000-8000-000000000415",
				option_value: "rebuild-testing",
				option_label: "Time to test clean-room rebuilds",
				sort_order: 4,
				viewer_option_id: optionId,
			},
		],
		error: null,
	});
	upsert.mockResolvedValue({ error: null });
	deleteProfileEq.mockResolvedValue({ error: null });
});

describe("idea validation service", () => {
	it("loads one focused question with ordered options and the viewer choice", async () => {
		await expect(getIdeaValidationQuestion(ideaId)).resolves.toEqual({
			id: questionId,
			prompt: "What could you bring to a first Project Time Capsule pilot?",
			viewerOptionId: optionId,
			options: [
				{
					id: optionId,
					value: "open-source-project",
					label: "An open-source project I maintain",
				},
				{
					id: "00000000-0000-4000-8000-000000000415",
					value: "rebuild-testing",
					label: "Time to test clean-room rebuilds",
				},
			],
		});
		expect(rpc).toHaveBeenCalledWith("get_idea_validation_question", {
			target_idea_id: ideaId,
		});
	});

	it("returns null when a concept has no active validation question", async () => {
		rpc.mockResolvedValueOnce({ data: [], error: null });

		await expect(getIdeaValidationQuestion(ideaId)).resolves.toBeNull();
	});

	it("loads aggregate pilot evidence without member identities", async () => {
		rpc.mockResolvedValueOnce({
			data: [
				{
					question_id: questionId,
					prompt: "What could you bring to a first Project Time Capsule pilot?",
					option_id: optionId,
					option_value: "open-source-project",
					option_label: "An open-source project I maintain",
					response_count: 3,
				},
				{
					question_id: questionId,
					prompt: "What could you bring to a first Project Time Capsule pilot?",
					option_id: "00000000-0000-4000-8000-000000000415",
					option_value: "rebuild-testing",
					option_label: "Time to test clean-room rebuilds",
					response_count: 2,
				},
			],
			error: null,
		});

		await expect(getIdeaValidationSummary(ideaId)).resolves.toEqual({
			questionId,
			prompt: "What could you bring to a first Project Time Capsule pilot?",
			totalResponses: 5,
			options: [
				{
					id: optionId,
					value: "open-source-project",
					label: "An open-source project I maintain",
					responseCount: 3,
				},
				{
					id: "00000000-0000-4000-8000-000000000415",
					value: "rebuild-testing",
					label: "Time to test clean-room rebuilds",
					responseCount: 2,
				},
			],
		});
		expect(rpc).toHaveBeenCalledWith("get_idea_validation_summary", {
			target_idea_id: ideaId,
		});
	});

	it("rejects mixed historical and active evidence instead of combining meanings", async () => {
		rpc.mockResolvedValueOnce({
			data: [
				{
					question_id: questionId,
					prompt: "Historical pilot question",
					option_id: optionId,
					option_value: "historical-answer",
					option_label: "Historical answer",
					response_count: 3,
				},
				{
					question_id: "00000000-0000-4000-8000-000000000601",
					prompt: "Is this bounty ready for an authorized test run?",
					option_id: "00000000-0000-4000-8000-000000000611",
					option_value: "ready-for-authorized-test",
					option_label: "Ready for an authorized test run",
					response_count: 2,
				},
			],
			error: null,
		});

		await expect(getIdeaValidationSummary(ideaId)).rejects.toThrow(
			"multiple validation questions",
		);
	});

	it("saves one private response idempotently for the current member", async () => {
		await expect(
			saveIdeaValidationResponse(questionId, optionId, profileId),
		).resolves.toBeUndefined();

		expect(from).toHaveBeenCalledWith("idea_validation_responses");
		expect(upsert).toHaveBeenCalledWith(
			{
				question_id: questionId,
				option_id: optionId,
				profile_id: profileId,
			},
			{ onConflict: "question_id,profile_id" },
		);
	});

	it("removes only the current member response", async () => {
		await expect(
			removeIdeaValidationResponse(questionId, profileId),
		).resolves.toBeUndefined();

		expect(remove).toHaveBeenCalledTimes(1);
		expect(deleteQuestionEq).toHaveBeenCalledWith("question_id", questionId);
		expect(deleteProfileEq).toHaveBeenCalledWith("profile_id", profileId);
	});

	it("propagates provider errors", async () => {
		const error = new Error("database details");
		rpc.mockResolvedValueOnce({ data: null, error });
		await expect(getIdeaValidationQuestion(ideaId)).rejects.toBe(error);

		upsert.mockResolvedValueOnce({ error });
		await expect(
			saveIdeaValidationResponse(questionId, optionId, profileId),
		).rejects.toBe(error);

		deleteProfileEq.mockResolvedValueOnce({ error });
		await expect(
			removeIdeaValidationResponse(questionId, profileId),
		).rejects.toBe(error);
	});
});
