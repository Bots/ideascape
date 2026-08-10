import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	getAdminAccess,
	getAdminDashboardSummary,
	getAdminIdeaActivity,
} from "@/features/admin/admin-service";
import { getSupabaseClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
	getSupabaseClient: vi.fn(),
}));

const rpc = vi.fn();

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(getSupabaseClient).mockReturnValue({
		rpc,
	} as unknown as ReturnType<typeof getSupabaseClient>);
});

describe("admin service", () => {
	it("loads the server-authoritative admin capability", async () => {
		rpc.mockResolvedValueOnce({ data: true, error: null });

		await expect(getAdminAccess()).resolves.toBe(true);
		expect(rpc).toHaveBeenCalledWith("is_ideascape_admin");
	});

	it("does not infer admin access from client identity", async () => {
		rpc.mockResolvedValueOnce({ data: false, error: null });

		await expect(getAdminAccess()).resolves.toBe(false);
	});

	it("maps the aggregate-only dashboard summary", async () => {
		rpc.mockResolvedValueOnce({
			data: [
				{
					member_count: 8,
					idea_count: 22,
					published_idea_count: 21,
					draft_idea_count: 1,
					interest_signal_count: 14,
					meaningful_signal_count: 9,
					validation_response_count: 17,
					pilot_count: 1,
					open_application_count: 2,
					accepted_application_count: 1,
					generated_at: "2026-08-10T14:30:00Z",
				},
			],
			error: null,
		});

		await expect(getAdminDashboardSummary()).resolves.toEqual({
			memberCount: 8,
			ideaCount: 22,
			publishedIdeaCount: 21,
			draftIdeaCount: 1,
			interestSignalCount: 14,
			meaningfulSignalCount: 9,
			validationResponseCount: 17,
			pilotCount: 1,
			openApplicationCount: 2,
			acceptedApplicationCount: 1,
			generatedAt: "2026-08-10T14:30:00Z",
		});
		expect(rpc).toHaveBeenCalledWith("get_admin_dashboard_summary");
	});

	it("returns null when the authenticated viewer is not an admin", async () => {
		rpc.mockResolvedValueOnce({ data: [], error: null });

		await expect(getAdminDashboardSummary()).resolves.toBeNull();
	});

	it("maps aggregate activity without member-level fields", async () => {
		rpc.mockResolvedValueOnce({
			data: [
				{
					idea_id: "00000000-0000-4000-8000-000000000218",
					slug: "project-time-capsule",
					title: "Project Time Capsule",
					category_name: "Technology",
					interest_signal_count: 11,
					validation_response_count: 7,
					pilot_application_count: 2,
					updated_at: "2026-08-10T14:00:00Z",
				},
			],
			error: null,
		});

		await expect(getAdminIdeaActivity()).resolves.toEqual([
			{
				ideaId: "00000000-0000-4000-8000-000000000218",
				slug: "project-time-capsule",
				title: "Project Time Capsule",
				categoryName: "Technology",
				interestSignalCount: 11,
				validationResponseCount: 7,
				pilotApplicationCount: 2,
				updatedAt: "2026-08-10T14:00:00Z",
			},
		]);
		expect(rpc).toHaveBeenCalledWith("get_admin_idea_activity");
	});

	it("propagates provider errors without rewriting them", async () => {
		const error = new Error("sensitive provider detail");
		rpc.mockResolvedValueOnce({ data: null, error });

		await expect(getAdminDashboardSummary()).rejects.toBe(error);
	});
});
