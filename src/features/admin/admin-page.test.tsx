import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, within } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdminPage } from "@/features/admin/admin-page";
import {
	getAdminDashboardSummary,
	getAdminIdeaActivity,
} from "@/features/admin/admin-service";
import { useAuth } from "@/features/auth/auth-provider";

vi.mock("@/features/auth/auth-provider", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/features/admin/admin-service", () => ({
	getAdminDashboardSummary: vi.fn(),
	getAdminIdeaActivity: vi.fn(),
}));

const summary = {
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
};

const activity = [
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
];

function createQueryClient() {
	return new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
}

function renderPageTree(queryClient: QueryClient) {
	return (
		<MemoryRouter initialEntries={["/admin"]}>
			<QueryClientProvider client={queryClient}>
				<AdminPage />
			</QueryClientProvider>
		</MemoryRouter>
	);
}

function renderPage(queryClient = createQueryClient()) {
	return render(renderPageTree(queryClient));
}

beforeEach(() => {
	vi.resetAllMocks();
	vi.mocked(useAuth).mockReturnValue({
		user: {
			id: "88888888-8888-4888-8888-888888888888",
			email: "botsone@gmail.com",
		} as User,
		isLoading: false,
	});
	vi.mocked(getAdminDashboardSummary).mockResolvedValue(summary);
	vi.mocked(getAdminIdeaActivity).mockResolvedValue(activity);
});

afterEach(cleanup);

describe("AdminPage", () => {
	it("requires authentication before requesting private aggregates", () => {
		vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false });
		renderPage();

		expect(
			screen.getByRole("heading", { name: /sign in to view operations/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
			"href",
			"/sign-in?returnTo=%2Fadmin",
		);
		expect(getAdminDashboardSummary).not.toHaveBeenCalled();
	});

	it("shows a safe loading state", () => {
		vi.mocked(getAdminDashboardSummary).mockReturnValue(new Promise(() => {}));
		renderPage();

		expect(screen.getByRole("status")).toHaveTextContent(
			/loading operations dashboard/i,
		);
	});

	it("shows aggregate operational state to an authorized admin", async () => {
		renderPage();

		expect(
			await screen.findByRole("heading", { name: /operations dashboard/i }),
		).toBeInTheDocument();
		const overview = screen.getByRole("region", {
			name: /operational overview/i,
		});
		expect(within(overview).getByText("8")).toBeInTheDocument();
		expect(within(overview).getByText("22")).toBeInTheDocument();
		expect(within(overview).getByText("14")).toBeInTheDocument();
		expect(within(overview).getByText("17")).toBeInTheDocument();
		expect(within(overview).getByText("2")).toBeInTheDocument();
		expect(await screen.findByText("Project Time Capsule")).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /project time capsule/i }),
		).toHaveAttribute("href", "/ideas/project-time-capsule");
		expect(
			screen.getByText(/respondent identities are excluded/i),
		).toBeInTheDocument();
		expect(screen.getByText(/draft content is excluded/i)).toBeInTheDocument();
	});

	it("shows an explicit unauthorized state without loading activity", async () => {
		vi.mocked(getAdminDashboardSummary).mockResolvedValue(null);
		renderPage();

		expect(
			await screen.findByRole("heading", { name: /admin access required/i }),
		).toBeInTheDocument();
		expect(screen.queryByText(/member count/i)).not.toBeInTheDocument();
		expect(getAdminIdeaActivity).not.toHaveBeenCalled();
	});

	it("does not reuse cached admin data after the authenticated identity changes", async () => {
		const queryClient = createQueryClient();
		const page = renderPage(queryClient);

		expect(
			await screen.findByRole("heading", { name: /operations dashboard/i }),
		).toBeInTheDocument();
		expect(await screen.findByText("Project Time Capsule")).toBeInTheDocument();

		vi.mocked(useAuth).mockReturnValue({
			user: {
				id: "99999999-9999-4999-8999-999999999999",
				email: "ordinary@example.invalid",
			} as User,
			isLoading: false,
		});
		vi.mocked(getAdminDashboardSummary).mockResolvedValueOnce(null);
		page.rerender(renderPageTree(queryClient));

		expect(
			await screen.findByRole("heading", { name: /admin access required/i }),
		).toBeInTheDocument();
		expect(screen.queryByText("Project Time Capsule")).not.toBeInTheDocument();
		expect(
			queryClient.getQueryData([
				"admin-dashboard-summary",
				"88888888-8888-4888-8888-888888888888",
			]),
		).toBeUndefined();
		expect(
			queryClient.getQueryData([
				"admin-idea-activity",
				"88888888-8888-4888-8888-888888888888",
			]),
		).toBeUndefined();
	});

	it("shows a useful empty activity state", async () => {
		vi.mocked(getAdminIdeaActivity).mockResolvedValue([]);
		renderPage();

		expect(
			await screen.findByText(/no published concept activity yet/i),
		).toBeInTheDocument();
	});

	it("shows a safe error without leaking provider details", async () => {
		vi.mocked(getAdminDashboardSummary).mockRejectedValue(
			new Error("sensitive provider detail"),
		);
		renderPage();

		expect(await screen.findByRole("alert")).toHaveTextContent(
			/unable to load the operations dashboard/i,
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(/sensitive/i);
	});
});
