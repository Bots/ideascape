import { getSupabaseClient } from "@/lib/supabase";

export type PilotStatus =
	| "validating"
	| "recruiting"
	| "active"
	| "completed"
	| "paused"
	| "archived";

export type PilotDecision =
	| "pending"
	| "continue"
	| "revise"
	| "pause"
	| "archive";

export type PilotPlan = {
	id: string;
	idea_id: string;
	slug: string;
	title: string;
	status: PilotStatus;
	decision: PilotDecision;
	evidence_window_days: number;
	signal_goal: number;
	continue_participant_threshold: number;
	continue_project_threshold: number;
	interview_goal: number;
	archive_signal_ceiling: number;
	project_capacity: number;
	decision_rationale: string | null;
	decided_at: string | null;
};

export type PilotReadinessSummary = {
	pilotId: string;
	meaningfulSignalCount: number;
	participantResponseCount: number;
	projectResponseCount: number;
	activeApplicationCount: number;
	acceptedApplicationCount: number;
	remainingCapacity: number;
	recommendation: PilotDecision;
};

type PilotReadinessSummaryRow = {
	pilot_id: string;
	meaningful_signal_count: number;
	participant_response_count: number;
	project_response_count: number;
	active_application_count: number;
	accepted_application_count: number;
	remaining_capacity: number;
	recommendation: PilotDecision;
};

const pilotPlanColumns =
	"id, idea_id, slug, title, status, decision, evidence_window_days, signal_goal, continue_participant_threshold, continue_project_threshold, interview_goal, archive_signal_ceiling, project_capacity, decision_rationale, decided_at";

export async function getPilotPlan(slug: string): Promise<PilotPlan | null> {
	const { data, error } = await getSupabaseClient()
		.from("idea_pilots")
		.select(pilotPlanColumns)
		.eq("slug", slug)
		.maybeSingle();

	if (error) {
		throw error;
	}

	return data as PilotPlan | null;
}

export async function getPilotReadinessSummary(
	pilotId: string,
): Promise<PilotReadinessSummary | null> {
	const { data, error } = await getSupabaseClient().rpc(
		"get_pilot_readiness_summary",
		{ target_pilot_id: pilotId },
	);

	if (error) {
		throw error;
	}

	const [row] = (data ?? []) as PilotReadinessSummaryRow[];
	if (!row) {
		return null;
	}

	return {
		pilotId: row.pilot_id,
		meaningfulSignalCount: Number(row.meaningful_signal_count),
		participantResponseCount: Number(row.participant_response_count),
		projectResponseCount: Number(row.project_response_count),
		activeApplicationCount: Number(row.active_application_count),
		acceptedApplicationCount: Number(row.accepted_application_count),
		remainingCapacity: Number(row.remaining_capacity),
		recommendation: row.recommendation,
	};
}
