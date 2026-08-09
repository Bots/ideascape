import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	getPublishedIdea,
	listPublishedIdeas,
} from "@/features/ideas/idea-discovery-service";
import { getSupabaseClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
	getSupabaseClient: vi.fn(),
}));

const listOrder = vi.fn();
const listNeq = vi.fn(() => ({ order: listOrder }));
const detailMaybeSingle = vi.fn();
const detailNeq = vi.fn(() => ({ maybeSingle: detailMaybeSingle }));
const detailEq = vi.fn(() => ({ neq: detailNeq }));
const select = vi.fn((columns: string) =>
	columns.includes("description") ? { eq: detailEq } : { neq: listNeq },
);
const from = vi.fn(() => ({ select }));
const rpc = vi.fn();

const creator = {
	id: "11111111-1111-4111-8111-111111111111",
	username: "idea-creator-11111111",
	display_name: "Idea Creator",
	avatar_url: "https://example.com/creator.png",
};
const category = {
	id: 1,
	slug: "technology",
	name: "Technology",
};
const summary = {
	id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
	slug: "solar-desalination-aaaaaaaa",
	title: "Solar desalination",
	summary: "Affordable clean water powered directly by sunlight.",
	status: "published" as const,
	published_at: "2026-08-09T00:00:00.000Z",
	created_at: "2026-08-08T00:00:00.000Z",
	category,
	creator,
	media: [
		{
			id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
			kind: "image" as const,
			url: "https://example.com/solar.png",
			alt_text: "Solar desalination prototype",
			sort_order: 0,
		},
	],
};
const detail = {
	...summary,
	description:
		"A modular desalination system designed for coastal communities.",
	media: [
		{
			id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
			kind: "image" as const,
			url: "https://example.com/solar.png",
			alt_text: "Solar desalination prototype",
			sort_order: 0,
		},
	],
};

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(getSupabaseClient).mockReturnValue({
		from,
		rpc,
	} as unknown as ReturnType<typeof getSupabaseClient>);
	listOrder.mockResolvedValue({ data: [summary], error: null });
	rpc.mockResolvedValue({
		data: [{ idea_id: summary.id, interest_count: 4 }],
		error: null,
	});
	detailMaybeSingle.mockResolvedValue({ data: detail, error: null });
});

describe("idea discovery service", () => {
	it("batches public interest counts into discovery summaries", async () => {
		const [result] = await listPublishedIdeas();

		expect(rpc).toHaveBeenCalledWith("get_idea_interest_counts", {
			target_idea_ids: [summary.id],
		});
		expect(result.interestCount).toBe(4);
	});

	it("lists non-draft ideas newest first with creator and category summaries", async () => {
		await expect(listPublishedIdeas()).resolves.toEqual([
			{ ...summary, interestCount: 4 },
		]);

		expect(from).toHaveBeenCalledWith("ideas");
		expect(listNeq).toHaveBeenCalledWith("status", "draft");
		expect(listOrder).toHaveBeenCalledWith("published_at", {
			ascending: false,
			nullsFirst: false,
		});
		expect(select.mock.calls[0]?.[0]).toContain("media:idea_media");
	});

	it("sorts discovery media so the first image is a stable cover", async () => {
		listOrder.mockResolvedValueOnce({
			data: [
				{
					...summary,
					media: [
						{ ...summary.media[0], id: "second", sort_order: 2 },
						{ ...summary.media[0], id: "first", sort_order: 0 },
					],
				},
			],
			error: null,
		});

		const [result] = await listPublishedIdeas();

		expect(result.media.map((item) => item.id)).toEqual(["first", "second"]);
	});

	it("loads a non-draft idea by exact slug and orders its media", async () => {
		await expect(getPublishedIdea(summary.slug)).resolves.toEqual(detail);

		expect(detailEq).toHaveBeenCalledWith("slug", summary.slug);
		expect(detailNeq).toHaveBeenCalledWith("status", "draft");
		expect(detail.media.map((item) => item.sort_order)).toEqual([0]);
	});

	it("sorts returned media defensively", async () => {
		detailMaybeSingle.mockResolvedValueOnce({
			data: {
				...detail,
				media: [
					{ ...detail.media[0], id: "second", sort_order: 2 },
					{ ...detail.media[0], id: "first", sort_order: 0 },
				],
			},
			error: null,
		});

		const result = await getPublishedIdea(summary.slug);

		expect(result?.media.map((item) => item.id)).toEqual(["first", "second"]);
	});

	it("returns null when a public idea does not exist", async () => {
		detailMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

		await expect(getPublishedIdea("missing-idea")).resolves.toBeNull();
	});

	it("throws Supabase errors", async () => {
		const error = new Error("database details");
		listOrder.mockResolvedValueOnce({ data: null, error });
		await expect(listPublishedIdeas()).rejects.toBe(error);

		detailMaybeSingle.mockResolvedValueOnce({ data: null, error });
		await expect(getPublishedIdea(summary.slug)).rejects.toBe(error);
	});
});
