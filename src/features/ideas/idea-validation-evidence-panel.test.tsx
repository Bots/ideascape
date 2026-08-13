import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/auth-provider";
import { IdeaValidationEvidencePanel } from "@/features/ideas/idea-validation-evidence-panel";
import { getIdeaValidationSummary } from "@/features/ideas/idea-validation-service";

vi.mock("@/features/auth/auth-provider", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/features/ideas/idea-validation-service", () => ({
	getIdeaValidationSummary: vi.fn(),
}));

const ideaId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const creatorId = "11111111-1111-4111-8111-111111111111";

function renderPanel() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return render(
		<QueryClientProvider client={queryClient}>
			<IdeaValidationEvidencePanel ideaId={ideaId} creatorId={creatorId} />
		</QueryClientProvider>,
	);
}

beforeEach(() => {
	vi.resetAllMocks();
	vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false });
	vi.mocked(getIdeaValidationSummary).mockResolvedValue({
		questionId: "00000000-0000-4000-8000-000000000401",
		prompt: "What could you bring to a first Project Time Capsule pilot?",
		totalResponses: 5,
		options: [
			{
				id: "00000000-0000-4000-8000-000000000411",
				value: "open-source-project",
				label: "An open-source project I maintain",
				responseCount: 3,
			},
			{
				id: "00000000-0000-4000-8000-000000000415",
				value: "rebuild-testing",
				label: "Time to test clean-room rebuilds",
				responseCount: 2,
			},
		],
	});
});

afterEach(cleanup);

describe("IdeaValidationEvidencePanel", () => {
	it("does not request private evidence for visitors or non-creators", () => {
		renderPanel();

		expect(getIdeaValidationSummary).not.toHaveBeenCalled();
		expect(
			screen.queryByText(/private security bounty evidence/i),
		).not.toBeInTheDocument();
	});

	it("shows aggregate answer totals only to the bounty author", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: { id: creatorId } as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		renderPanel();

		expect(
			await screen.findByRole("region", {
				name: /private security bounty evidence/i,
			}),
		).toBeInTheDocument();
		expect(screen.getByText("5 total responses")).toBeInTheDocument();
		expect(screen.getByText("3 responses")).toBeInTheDocument();
		expect(screen.getByText("2 responses")).toBeInTheDocument();
		expect(
			screen.getByText(/respondent identities are never included/i),
		).toBeInTheDocument();
		expect(getIdeaValidationSummary).toHaveBeenCalledWith(ideaId);
	});

	it("shows an honest zero-response state", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: { id: creatorId } as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		vi.mocked(getIdeaValidationSummary).mockResolvedValue({
			questionId: "00000000-0000-4000-8000-000000000401",
			prompt: "What could you bring to a first Project Time Capsule pilot?",
			totalResponses: 0,
			options: [],
		});
		renderPanel();

		expect(
			await screen.findByText(/no readiness responses yet/i),
		).toBeInTheDocument();
	});

	it("renders a safe creator-only failure state", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: { id: creatorId } as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		vi.mocked(getIdeaValidationSummary).mockRejectedValue(
			new Error("sensitive database details"),
		);
		renderPanel();

		expect(await screen.findByRole("alert")).toHaveTextContent(
			/private security bounty evidence is unavailable right now/i,
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(/sensitive/i);
	});
});
