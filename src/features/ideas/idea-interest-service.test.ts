import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	getIdeaInterestSummary,
	removeIdeaInterest,
	signalIdeaInterest,
} from "@/features/ideas/idea-interest-service";
import { getSupabaseClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
	getSupabaseClient: vi.fn(),
}));

const summaryMaybeSingle = vi.fn();
const rpc = vi.fn(() => ({ maybeSingle: summaryMaybeSingle }));
const upsert = vi.fn();
const deleteProfileEq = vi.fn();
const deleteIdeaEq = vi.fn(() => ({ eq: deleteProfileEq }));
const remove = vi.fn(() => ({ eq: deleteIdeaEq }));
const from = vi.fn(() => ({ upsert, delete: remove }));

const ideaId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const profileId = "11111111-1111-4111-8111-111111111111";

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(getSupabaseClient).mockReturnValue({
		rpc,
		from,
	} as unknown as ReturnType<typeof getSupabaseClient>);
	summaryMaybeSingle.mockResolvedValue({
		data: {
			interest_count: 7,
			viewer_has_interest: true,
			viewer_participation_intent: "pilot",
		},
		error: null,
	});
	upsert.mockResolvedValue({ error: null });
	deleteProfileEq.mockResolvedValue({ error: null });
});

describe("idea interest service", () => {
	it("loads the public count and current member state", async () => {
		await expect(getIdeaInterestSummary(ideaId)).resolves.toEqual({
			interestCount: 7,
			viewerHasInterest: true,
			viewerIntent: "pilot",
		});

		expect(rpc).toHaveBeenCalledWith("get_idea_interest_summary", {
			target_idea_id: ideaId,
		});
	});

	it("returns an empty summary when the idea is unavailable", async () => {
		summaryMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

		await expect(getIdeaInterestSummary(ideaId)).resolves.toEqual({
			interestCount: 0,
			viewerHasInterest: false,
			viewerIntent: null,
		});
	});

	it("records participation intent idempotently for the current member", async () => {
		await expect(
			signalIdeaInterest(ideaId, profileId, "pilot"),
		).resolves.toBeUndefined();

		expect(from).toHaveBeenCalledWith("idea_interests");
		expect(upsert).toHaveBeenCalledWith(
			{
				idea_id: ideaId,
				profile_id: profileId,
				participation_intent: "pilot",
			},
			{
				onConflict: "idea_id,profile_id",
			},
		);
	});

	it("removes only the current member interest", async () => {
		await expect(
			removeIdeaInterest(ideaId, profileId),
		).resolves.toBeUndefined();

		expect(remove).toHaveBeenCalledTimes(1);
		expect(deleteIdeaEq).toHaveBeenCalledWith("idea_id", ideaId);
		expect(deleteProfileEq).toHaveBeenCalledWith("profile_id", profileId);
	});

	it("propagates provider errors", async () => {
		const error = new Error("database details");
		summaryMaybeSingle.mockResolvedValueOnce({ data: null, error });
		await expect(getIdeaInterestSummary(ideaId)).rejects.toBe(error);

		upsert.mockResolvedValueOnce({ error });
		await expect(signalIdeaInterest(ideaId, profileId, "build")).rejects.toBe(
			error,
		);

		deleteProfileEq.mockResolvedValueOnce({ error });
		await expect(removeIdeaInterest(ideaId, profileId)).rejects.toBe(error);
	});
});
