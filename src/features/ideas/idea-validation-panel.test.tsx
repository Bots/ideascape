import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	cleanup,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/auth-provider";
import { IdeaValidationPanel } from "@/features/ideas/idea-validation-panel";
import {
	getIdeaValidationQuestion,
	removeIdeaValidationResponse,
	saveIdeaValidationResponse,
} from "@/features/ideas/idea-validation-service";

vi.mock("@/features/auth/auth-provider", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/features/ideas/idea-validation-service", () => ({
	getIdeaValidationQuestion: vi.fn(),
	saveIdeaValidationResponse: vi.fn(),
	removeIdeaValidationResponse: vi.fn(),
}));

const ideaId = "00000000-0000-4000-8000-000000000218";
const questionId = "00000000-0000-4000-8000-000000000401";
const userId = "55555555-5555-4555-8555-555555555555";
const question = {
	id: questionId,
	prompt: "What could you bring to a first Project Time Capsule pilot?",
	viewerOptionId: null,
	options: [
		{
			id: "00000000-0000-4000-8000-000000000411",
			value: "open-source-project",
			label: "An open-source project I maintain",
		},
		{
			id: "00000000-0000-4000-8000-000000000415",
			value: "rebuild-testing",
			label: "Time to test clean-room rebuilds",
		},
	],
};

function renderPanel() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});

	return render(
		<MemoryRouter initialEntries={["/ideas/project-time-capsule"]}>
			<QueryClientProvider client={queryClient}>
				<IdeaValidationPanel ideaId={ideaId} />
			</QueryClientProvider>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.resetAllMocks();
	vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false });
	vi.mocked(getIdeaValidationQuestion).mockResolvedValue(question);
	vi.mocked(saveIdeaValidationResponse).mockResolvedValue();
	vi.mocked(removeIdeaValidationResponse).mockResolvedValue();
});

afterEach(cleanup);

describe("IdeaValidationPanel", () => {
	it("shows the focused pilot question and a private sign-in path to visitors", async () => {
		renderPanel();

		const region = await screen.findByRole("region", {
			name: question.prompt,
		});
		expect(
			within(region).getByText(/authorized test-run readiness/i),
		).toBeInTheDocument();
		expect(
			within(region).getByText("An open-source project I maintain"),
		).toBeInTheDocument();
		expect(
			within(region).getByText("Time to test clean-room rebuilds"),
		).toBeInTheDocument();
		expect(
			within(region).getByRole("link", {
				name: /sign in to answer privately/i,
			}),
		).toHaveAttribute(
			"href",
			"/sign-in?returnTo=%2Fideas%2Fproject-time-capsule",
		);
		expect(region).toHaveTextContent(
			/system owner sees aggregate totals only/i,
		);
		expect(region).toHaveTextContent(
			/rules of engagement, a reproducible proof threshold, and an authorized test environment/i,
		);
		expect(region).toHaveTextContent(/possible answers/i);
		expect(region).not.toHaveTextContent(/preservation pilot/i);
	});

	it("lets a signed-in member save one private pilot answer", async () => {
		const user = userEvent.setup();
		vi.mocked(useAuth).mockReturnValue({
			user: { id: userId } as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		renderPanel();

		const option = await screen.findByRole("button", {
			name: "Time to test clean-room rebuilds",
		});
		expect(option).toHaveAttribute("aria-pressed", "false");
		await user.click(option);

		expect(saveIdeaValidationResponse).toHaveBeenCalledWith(
			questionId,
			"00000000-0000-4000-8000-000000000415",
			userId,
		);
		expect(option).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByText(/answer saved privately/i)).toBeInTheDocument();
	});

	it("changes an existing answer without creating another response", async () => {
		const user = userEvent.setup();
		vi.mocked(useAuth).mockReturnValue({
			user: { id: userId } as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		vi.mocked(getIdeaValidationQuestion).mockResolvedValue({
			...question,
			viewerOptionId: "00000000-0000-4000-8000-000000000411",
		});
		renderPanel();

		const first = await screen.findByRole("button", {
			name: "An open-source project I maintain",
		});
		const second = screen.getByRole("button", {
			name: "Time to test clean-room rebuilds",
		});
		expect(first).toHaveAttribute("aria-pressed", "true");
		await user.click(second);

		expect(saveIdeaValidationResponse).toHaveBeenCalledTimes(1);
		expect(second).toHaveAttribute("aria-pressed", "true");
		expect(first).toHaveAttribute("aria-pressed", "false");
	});

	it("lets a member remove their pilot answer", async () => {
		const user = userEvent.setup();
		vi.mocked(useAuth).mockReturnValue({
			user: { id: userId } as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		vi.mocked(getIdeaValidationQuestion).mockResolvedValue({
			...question,
			viewerOptionId: "00000000-0000-4000-8000-000000000411",
		});
		renderPanel();

		await user.click(
			await screen.findByRole("button", { name: /remove my answer/i }),
		);

		expect(removeIdeaValidationResponse).toHaveBeenCalledWith(
			questionId,
			userId,
		);
		expect(
			screen.queryByRole("button", { name: /remove my answer/i }),
		).not.toBeInTheDocument();
	});

	it("renders nothing when a concept has no active validation question", async () => {
		vi.mocked(getIdeaValidationQuestion).mockResolvedValue(null);
		renderPanel();

		await waitFor(() => expect(getIdeaValidationQuestion).toHaveBeenCalled());
		expect(
			screen.queryByText(/pilot readiness question/i),
		).not.toBeInTheDocument();
	});

	it("renders a safe failure state", async () => {
		vi.mocked(getIdeaValidationQuestion).mockRejectedValue(
			new Error("sensitive database details"),
		);
		renderPanel();

		expect(await screen.findByRole("alert")).toHaveTextContent(
			/bounty readiness question is unavailable right now/i,
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(/sensitive/i);
	});
});
