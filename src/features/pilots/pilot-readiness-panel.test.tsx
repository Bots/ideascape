import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/auth-provider";
import { PilotReadinessPanel } from "@/features/pilots/pilot-readiness-panel";
import { getPilotReadinessSummary } from "@/features/pilots/pilot-service";

vi.mock("@/features/auth/auth-provider", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/features/pilots/pilot-service", () => ({
	getPilotReadinessSummary: vi.fn(),
}));

const pilotId = "00000000-0000-4000-8000-000000000501";

function renderPanel() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return render(
		<QueryClientProvider client={queryClient}>
			<PilotReadinessPanel pilotId={pilotId} />
		</QueryClientProvider>,
	);
}

beforeEach(() => {
	vi.resetAllMocks();
	vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false });
	vi.mocked(getPilotReadinessSummary).mockResolvedValue({
		pilotId,
		meaningfulSignalCount: 9,
		participantResponseCount: 5,
		projectResponseCount: 3,
		activeApplicationCount: 2,
		acceptedApplicationCount: 1,
		remainingCapacity: 2,
		recommendation: "continue",
	});
});

afterEach(cleanup);

describe("PilotReadinessPanel", () => {
	it("does not request private readiness evidence for visitors", () => {
		renderPanel();

		expect(getPilotReadinessSummary).not.toHaveBeenCalled();
		expect(
			screen.queryByRole("region", { name: /private readiness dashboard/i }),
		).not.toBeInTheDocument();
	});

	it("stays hidden when the authenticated member is not authorized", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: { id: "member-id" } as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		vi.mocked(getPilotReadinessSummary).mockResolvedValue(null);
		renderPanel();

		await vi.waitFor(() => {
			expect(getPilotReadinessSummary).toHaveBeenCalledWith(pilotId);
		});
		expect(
			screen.queryByRole("region", { name: /private readiness dashboard/i }),
		).not.toBeInTheDocument();
	});

	it("shows aggregate progress and a decision preview to authorized reviewers", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: { id: "creator-id" } as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		renderPanel();

		const dashboard = await screen.findByRole("region", {
			name: /private readiness dashboard/i,
		});
		expect(within(dashboard).getByText("9")).toBeInTheDocument();
		expect(within(dashboard).getByText("5")).toBeInTheDocument();
		expect(within(dashboard).getByText("3")).toBeInTheDocument();
		expect(within(dashboard).getByText(/ready reviewers/i)).toBeInTheDocument();
		expect(dashboard).not.toHaveTextContent(/participant responses/i);
		expect(within(dashboard).getByText("2 active")).toBeInTheDocument();
		expect(within(dashboard).getByText("1 accepted")).toBeInTheDocument();
		expect(within(dashboard).getByText("2 spaces remain")).toBeInTheDocument();
		expect(
			within(dashboard).getByText(/continue threshold met/i),
		).toBeInTheDocument();
		expect(dashboard).toHaveTextContent(
			/respondent identities are never included/i,
		);
	});

	it("shows a safe failure without leaking provider details", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: { id: "creator-id" } as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		vi.mocked(getPilotReadinessSummary).mockRejectedValue(
			new Error("sensitive provider details"),
		);
		renderPanel();

		expect(await screen.findByRole("alert")).toHaveTextContent(
			/readiness evidence is unavailable/i,
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(/sensitive/i);
	});
});
