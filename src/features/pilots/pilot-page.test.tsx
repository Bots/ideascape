import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/auth-provider";
import { PilotPage } from "@/features/pilots/pilot-page";
import { getPilotPlan } from "@/features/pilots/pilot-service";

vi.mock("@/features/auth/auth-provider", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/features/pilots/pilot-service", () => ({
	getPilotPlan: vi.fn(),
}));

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

function renderPage() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return render(
		<MemoryRouter initialEntries={["/pilots/project-time-capsule"]}>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path="/pilots/:pilotSlug" element={<PilotPage />} />
				</Routes>
			</QueryClientProvider>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.resetAllMocks();
	vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false });
	vi.mocked(getPilotPlan).mockResolvedValue(pilot);
});

afterEach(cleanup);

describe("PilotPage", () => {
	it("shows an accessible loading state", () => {
		vi.mocked(getPilotPlan).mockReturnValue(new Promise(() => {}));
		renderPage();

		expect(screen.getByRole("status")).toHaveTextContent(/loading pilot plan/i);
	});

	it("publishes measurable thresholds and permission-first pilot boundaries", async () => {
		renderPage();

		expect(
			await screen.findByRole("heading", {
				name: "Project Time Capsule pilot",
			}),
		).toBeInTheDocument();
		expect(screen.getByText(/validation underway/i)).toBeInTheDocument();
		expect(screen.getByLabelText("30-day evidence window")).toBeInTheDocument();
		expect(screen.getByLabelText("15 meaningful signals")).toBeInTheDocument();
		expect(
			screen.getByLabelText("5 participant interviews"),
		).toBeInTheDocument();
		expect(
			screen.getByLabelText("3-project pilot capacity"),
		).toBeInTheDocument();

		const decisions = screen.getByRole("region", { name: /decision rules/i });
		expect(within(decisions).getByText(/^continue$/i)).toBeInTheDocument();
		expect(decisions).toHaveTextContent(/5 qualified pilot participants/i);
		expect(decisions).toHaveTextContent(/3 suitable authorized projects/i);
		expect(within(decisions).getByText(/^revise$/i)).toBeInTheDocument();
		expect(within(decisions).getByText(/^archive$/i)).toBeInTheDocument();
		expect(decisions).toHaveTextContent(/2 or fewer meaningful signals/i);

		const boundaries = screen.getByRole("region", {
			name: /pilot boundaries/i,
		});
		expect(boundaries).toHaveTextContent(
			/participant-authorized projects only/i,
		);
		expect(boundaries).toHaveTextContent(/unauthorized proprietary source/i);
		expect(boundaries).toHaveTextContent(/private production data/i);
		expect(boundaries).toHaveTextContent(/secrets or live credentials/i);
		expect(boundaries).toHaveTextContent(/no payment or commitment/i);
	});

	it("keeps intake closed while validation is underway", async () => {
		renderPage();

		expect(
			await screen.findByText(/pilot intake is not open yet/i),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: /sign in to apply/i }),
		).not.toBeInTheDocument();
	});

	it("offers a private sign-in path when recruiting begins", async () => {
		vi.mocked(getPilotPlan).mockResolvedValue({
			...pilot,
			status: "recruiting",
		});
		renderPage();

		expect(
			await screen.findByRole("link", { name: /sign in to apply privately/i }),
		).toHaveAttribute(
			"href",
			"/sign-in?returnTo=%2Fpilots%2Fproject-time-capsule",
		);
	});

	it("shows a useful not-found state", async () => {
		vi.mocked(getPilotPlan).mockResolvedValue(null);
		renderPage();

		expect(
			await screen.findByRole("heading", { name: /pilot plan not found/i }),
		).toBeInTheDocument();
	});

	it("shows a safe error state", async () => {
		vi.mocked(getPilotPlan).mockRejectedValue(
			new Error("sensitive provider details"),
		);
		renderPage();

		expect(await screen.findByRole("alert")).toHaveTextContent(
			/unable to load the pilot plan/i,
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(/sensitive/i);
	});
});
