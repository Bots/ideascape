import { getSupabaseClient } from "@/lib/supabase";

export interface AdminDashboardSummary {
	memberCount: number;
	ideaCount: number;
	publishedIdeaCount: number;
	draftIdeaCount: number;
	interestSignalCount: number;
	meaningfulSignalCount: number;
	validationResponseCount: number;
	pilotCount: number;
	openApplicationCount: number;
	acceptedApplicationCount: number;
	generatedAt: string;
}

export interface AdminIdeaActivity {
	ideaId: string;
	slug: string;
	title: string;
	categoryName: string | null;
	interestSignalCount: number;
	validationResponseCount: number;
	pilotApplicationCount: number;
	updatedAt: string;
}

interface AdminDashboardSummaryRow {
	member_count: number | string;
	idea_count: number | string;
	published_idea_count: number | string;
	draft_idea_count: number | string;
	interest_signal_count: number | string;
	meaningful_signal_count: number | string;
	validation_response_count: number | string;
	pilot_count: number | string;
	open_application_count: number | string;
	accepted_application_count: number | string;
	generated_at: string;
}

interface AdminIdeaActivityRow {
	idea_id: string;
	slug: string;
	title: string;
	category_name: string | null;
	interest_signal_count: number | string;
	validation_response_count: number | string;
	pilot_application_count: number | string;
	updated_at: string;
}

export async function getAdminAccess(): Promise<boolean> {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase.rpc("is_ideascape_admin");

	if (error) {
		throw error;
	}

	return data === true;
}

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary | null> {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase.rpc("get_admin_dashboard_summary");

	if (error) {
		throw error;
	}

	const [row] = (data ?? []) as AdminDashboardSummaryRow[];
	if (!row) {
		return null;
	}

	return {
		memberCount: Number(row.member_count),
		ideaCount: Number(row.idea_count),
		publishedIdeaCount: Number(row.published_idea_count),
		draftIdeaCount: Number(row.draft_idea_count),
		interestSignalCount: Number(row.interest_signal_count),
		meaningfulSignalCount: Number(row.meaningful_signal_count),
		validationResponseCount: Number(row.validation_response_count),
		pilotCount: Number(row.pilot_count),
		openApplicationCount: Number(row.open_application_count),
		acceptedApplicationCount: Number(row.accepted_application_count),
		generatedAt: row.generated_at,
	};
}

export async function getAdminIdeaActivity(): Promise<AdminIdeaActivity[]> {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase.rpc("get_admin_idea_activity");

	if (error) {
		throw error;
	}

	return ((data ?? []) as AdminIdeaActivityRow[]).map((row) => ({
		ideaId: row.idea_id,
		slug: row.slug,
		title: row.title,
		categoryName: row.category_name,
		interestSignalCount: Number(row.interest_signal_count),
		validationResponseCount: Number(row.validation_response_count),
		pilotApplicationCount: Number(row.pilot_application_count),
		updatedAt: row.updated_at,
	}));
}
