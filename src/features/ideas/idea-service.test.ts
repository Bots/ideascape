import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createIdeaDraft,
	getIdeaForEditing,
	listCategories,
	updateIdeaDraft,
} from "@/features/ideas/idea-service";
import { getSupabaseClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
	getSupabaseClient: vi.fn(),
}));

const categoryOrder = vi.fn();
const categorySelect = vi.fn(() => ({ order: categoryOrder }));
const ideaSingle = vi.fn();
const ideaSelectAfterInsert = vi.fn(() => ({ single: ideaSingle }));
const ideaInsert = vi.fn(() => ({ select: ideaSelectAfterInsert }));
const ideaEqAfterSelect = vi.fn(() => ({ single: ideaSingle }));
const ideaSelectForEditing = vi.fn(() => ({ eq: ideaEqAfterSelect }));
const ideaSelectAfterUpdate = vi.fn(() => ({ single: ideaSingle }));
const ideaEqAfterUpdate = vi.fn(() => ({ select: ideaSelectAfterUpdate }));
const ideaUpdate = vi.fn(() => ({ eq: ideaEqAfterUpdate }));
const from = vi.fn((table: string) => {
	if (table === "categories") {
		return { select: categorySelect };
	}

	return {
		insert: ideaInsert,
		select: ideaSelectForEditing,
		update: ideaUpdate,
	};
});

const category = {
	id: 1,
	slug: "technology",
	name: "Technology",
	description: "Tools and technical inventions.",
};

const idea = {
	id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
	creator_id: "11111111-1111-4111-8111-111111111111",
	category_id: 1,
	slug: "solar-desalination-aaaaaaaa",
	title: "Solar desalination",
	summary: "Affordable clean water powered directly by sunlight.",
	description:
		"A bounded desalination security review with explicit authority and shutdown conditions.",
	threat_scenario:
		"A poisoned source or failed control could expose downstream systems.",
	control_boundary:
		"Testing stays isolated from production and requires written authorization.",
	proof_required:
		"Independent results must meet the published safety and shutdown thresholds.",
	status: "draft" as const,
	published_at: null,
	created_at: "2026-08-09T00:00:00.000Z",
	updated_at: "2026-08-09T00:00:00.000Z",
};

const values = {
	categoryId: 1,
	title: idea.title,
	summary: idea.summary,
	description: idea.description,
	threatScenario: idea.threat_scenario,
	controlBoundary: idea.control_boundary,
	proofRequired: idea.proof_required,
};

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(getSupabaseClient).mockReturnValue({
		from,
	} as unknown as ReturnType<typeof getSupabaseClient>);
	categoryOrder.mockResolvedValue({ data: [category], error: null });
	ideaSingle.mockResolvedValue({ data: idea, error: null });
});

describe("idea service", () => {
	it("lists categories in display-name order", async () => {
		await expect(listCategories()).resolves.toEqual([category]);

		expect(from).toHaveBeenCalledWith("categories");
		expect(categorySelect).toHaveBeenCalledWith("id, slug, name, description");
		expect(categoryOrder).toHaveBeenCalledWith("name");
	});

	it("creates a draft with a URL-safe collision-resistant slug", async () => {
		vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue(
			"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
		);

		await expect(
			createIdeaDraft("11111111-1111-4111-8111-111111111111", values),
		).resolves.toEqual(idea);

		expect(ideaInsert).toHaveBeenCalledWith({
			id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
			creator_id: "11111111-1111-4111-8111-111111111111",
			category_id: 1,
			slug: "solar-desalination-aaaaaaaa",
			title: idea.title,
			summary: idea.summary,
			description: idea.description,
			threat_scenario: idea.threat_scenario,
			control_boundary: idea.control_boundary,
			proof_required: idea.proof_required,
		});
	});

	it("loads a draft for editing by id", async () => {
		await expect(getIdeaForEditing(idea.id)).resolves.toEqual(idea);

		expect(ideaSelectForEditing).toHaveBeenCalled();
		expect(ideaEqAfterSelect).toHaveBeenCalledWith("id", idea.id);
	});

	it("updates editable draft fields without changing ownership or lifecycle", async () => {
		await expect(updateIdeaDraft(idea.id, values)).resolves.toEqual(idea);

		expect(ideaUpdate).toHaveBeenCalledWith({
			category_id: 1,
			title: idea.title,
			summary: idea.summary,
			description: idea.description,
			threat_scenario: idea.threat_scenario,
			control_boundary: idea.control_boundary,
			proof_required: idea.proof_required,
		});
		expect(ideaEqAfterUpdate).toHaveBeenCalledWith("id", idea.id);
	});

	it("throws errors returned by each Supabase operation", async () => {
		const error = new Error("Supabase details");
		categoryOrder.mockResolvedValueOnce({ data: null, error });
		await expect(listCategories()).rejects.toBe(error);

		ideaSingle.mockResolvedValueOnce({ data: null, error });
		await expect(
			createIdeaDraft("11111111-1111-4111-8111-111111111111", values),
		).rejects.toBe(error);

		ideaSingle.mockResolvedValueOnce({ data: null, error });
		await expect(getIdeaForEditing(idea.id)).rejects.toBe(error);

		ideaSingle.mockResolvedValueOnce({ data: null, error });
		await expect(updateIdeaDraft(idea.id, values)).rejects.toBe(error);
	});
});
