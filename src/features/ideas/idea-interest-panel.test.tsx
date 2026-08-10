import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/auth-provider";
import { IdeaInterestPanel } from "@/features/ideas/idea-interest-panel";
import {
	getIdeaInterestSummary,
	removeIdeaInterest,
	signalIdeaInterest,
} from "@/features/ideas/idea-interest-service";

vi.mock("@/features/auth/auth-provider", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/features/ideas/idea-interest-service", () => ({
	getIdeaInterestSummary: vi.fn(),
	signalIdeaInterest: vi.fn(),
	removeIdeaInterest: vi.fn(),
}));

const ideaId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const userId = "11111111-1111-4111-8111-111111111111";

function renderPanel() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});

	return render(
		<MemoryRouter initialEntries={["/ideas/clean-air-library"]}>
			<QueryClientProvider client={queryClient}>
				<IdeaInterestPanel ideaId={ideaId} />
			</QueryClientProvider>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.resetAllMocks();
	vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false });
	vi.mocked(getIdeaInterestSummary).mockResolvedValue({
		interestCount: 12,
		viewerHasInterest: false,
		viewerIntent: null,
	});
	vi.mocked(signalIdeaInterest).mockResolvedValue();
	vi.mocked(removeIdeaInterest).mockResolvedValue();
});

afterEach(cleanup);

describe("IdeaInterestPanel", () => {
	it("shows the public count and a sign-in path to visitors", async () => {
		renderPanel();

		expect(
			await screen.findByRole("heading", {
				name: /would you want to see this happen/i,
			}),
		).toBeInTheDocument();
		expect(
			await screen.findByText(/12 people are interested/i),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /sign in to show interest/i }),
		).toHaveAttribute("href", "/sign-in?returnTo=%2Fideas%2Fclean-air-library");
	});

	it("lets a signed-in member signal how they would participate", async () => {
		const user = userEvent.setup();
		vi.mocked(useAuth).mockReturnValue({
			user: { id: userId } as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		renderPanel();

		const intentGroup = await screen.findByRole("group", {
			name: /how would you participate/i,
		});
		const pilotButton = within(intentGroup).getByRole("button", {
			name: /i could test a pilot/i,
		});
		expect(pilotButton).toHaveAttribute("aria-pressed", "false");
		await user.click(pilotButton);

		expect(signalIdeaInterest).toHaveBeenCalledWith(ideaId, userId, "pilot");
		expect(
			await screen.findByText(/13 people are interested/i),
		).toBeInTheDocument();
		expect(pilotButton).toHaveAttribute("aria-pressed", "true");
	});

	it("updates participation intent without increasing the public count twice", async () => {
		const user = userEvent.setup();
		vi.mocked(useAuth).mockReturnValue({
			user: { id: userId } as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		vi.mocked(getIdeaInterestSummary).mockResolvedValue({
			interestCount: 12,
			viewerHasInterest: true,
			viewerIntent: "use",
		});
		renderPanel();

		const useButton = await screen.findByRole("button", {
			name: /i would use this/i,
		});
		const buildButton = screen.getByRole("button", {
			name: /i would help build it/i,
		});
		expect(useButton).toHaveAttribute("aria-pressed", "true");
		await user.click(buildButton);

		expect(signalIdeaInterest).toHaveBeenCalledWith(ideaId, userId, "build");
		expect(screen.getByText(/12 people are interested/i)).toBeInTheDocument();
		expect(buildButton).toHaveAttribute("aria-pressed", "true");
		expect(useButton).toHaveAttribute("aria-pressed", "false");
	});

	it("lets a signed-in member remove their interest", async () => {
		const user = userEvent.setup();
		vi.mocked(useAuth).mockReturnValue({
			user: { id: userId } as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		vi.mocked(getIdeaInterestSummary).mockResolvedValue({
			interestCount: 12,
			viewerHasInterest: true,
			viewerIntent: "pilot",
		});
		renderPanel();

		const interestButton = await screen.findByRole("button", {
			name: /remove interest/i,
		});
		expect(interestButton).toHaveAttribute("aria-pressed", "true");
		await user.click(interestButton);

		expect(removeIdeaInterest).toHaveBeenCalledWith(ideaId, userId);
		expect(
			await screen.findByText(/11 people are interested/i),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /remove interest/i }),
		).not.toBeInTheDocument();
	});

	it("renders a safe failure state", async () => {
		vi.mocked(getIdeaInterestSummary).mockRejectedValue(
			new Error("sensitive database details"),
		);
		renderPanel();

		expect(await screen.findByRole("alert")).toHaveTextContent(
			/interest signals are unavailable right now/i,
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(/sensitive/i);
	});
});
