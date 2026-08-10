import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	getPilotPlan,
	getPilotReadinessSummary,
} from "@/features/pilots/pilot-service";
import { getSupabaseClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
	getSupabaseClient: vi.fn(),
}));

const maybeSingle = vi.fn();
const eq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq }));
const from = vi.fn(() => ({ select }));
const rpc = vi.fn();

const pilot = {
	id: "00000000-0000-4000-8000-000000000501",
	idea_id: "00000000-0000-4000-8000-000000000218",
	slug: "project-time-capsule",
	title: "Project Time Capsule pilot",
	status: "validating" as const,
	decision: "pending" as const,
	evidence_window_days: 30,
	signal_goal: 15,
	continue_participant_threshold: 5,
	continue_project_threshold: 3,
	interview_goal: 5,
	archive_signal_ceiling: 2,
	project_capacity: 3,
	decision_rationale: null,
	decided_at: null,
};

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(getSupabaseClient).mockReturnValue({
		from,
		rpc,
	} as unknown as ReturnType<typeof getSupabaseClient>);
	maybeSingle.mockResolvedValue({ data: pilot, error: null });
	rpc.mockResolvedValue({
		data: [
			{
				pilot_id: pilot.id,
				meaningful_signal_count: 9,
				participant_response_count: 5,
				project_response_count: 3,
				active_application_count: 2,
				accepted_application_count: 1,
				remaining_capacity: 2,
				recommendation: "continue",
			},
		],
		error: null,
	});
});

describe("pilot service", () => {
	it("loads a public pilot plan and its explicit evidence thresholds", async () => {
		await expect(getPilotPlan("project-time-capsule")).resolves.toEqual(pilot);

		expect(from).toHaveBeenCalledWith("idea_pilots");
		expect(select).toHaveBeenCalledWith(
			"id, idea_id, slug, title, status, decision, evidence_window_days, signal_goal, continue_participant_threshold, continue_project_threshold, interview_goal, archive_signal_ceiling, project_capacity, decision_rationale, decided_at",
		);
		expect(eq).toHaveBeenCalledWith("slug", "project-time-capsule");
	});

	it("returns null when no public pilot plan exists", async () => {
		maybeSingle.mockResolvedValueOnce({ data: null, error: null });

		await expect(getPilotPlan("unknown")).resolves.toBeNull();
	});

	it("propagates provider errors", async () => {
		const error = new Error("provider details");
		maybeSingle.mockResolvedValueOnce({ data: null, error });

		await expect(getPilotPlan("project-time-capsule")).rejects.toBe(error);
	});

	it("maps the private aggregate readiness summary", async () => {
		await expect(getPilotReadinessSummary(pilot.id)).resolves.toEqual({
			pilotId: pilot.id,
			meaningfulSignalCount: 9,
			participantResponseCount: 5,
			projectResponseCount: 3,
			activeApplicationCount: 2,
			acceptedApplicationCount: 1,
			remainingCapacity: 2,
			recommendation: "continue",
		});
		expect(rpc).toHaveBeenCalledWith("get_pilot_readiness_summary", {
			target_pilot_id: pilot.id,
		});
	});

	it("returns null when the viewer is not an authorized reviewer", async () => {
		rpc.mockResolvedValueOnce({ data: [], error: null });

		await expect(getPilotReadinessSummary(pilot.id)).resolves.toBeNull();
	});

	it("propagates readiness provider errors", async () => {
		const error = new Error("provider details");
		rpc.mockResolvedValueOnce({ data: null, error });

		await expect(getPilotReadinessSummary(pilot.id)).rejects.toBe(error);
	});
});
