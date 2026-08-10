import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/auth-provider";
import { IdeaDetailPage } from "@/features/ideas/idea-detail-page";
import {
	getPublishedIdea,
	listPublishedIdeas,
} from "@/features/ideas/idea-discovery-service";
import { getIdeaInterestSummary } from "@/features/ideas/idea-interest-service";
import { getIdeaValidationQuestion } from "@/features/ideas/idea-validation-service";

vi.mock("@/features/auth/auth-provider", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/features/ideas/idea-discovery-service", () => ({
	getPublishedIdea: vi.fn(),
	listPublishedIdeas: vi.fn(),
}));

vi.mock("@/features/ideas/idea-interest-service", () => ({
	getIdeaInterestSummary: vi.fn(),
	signalIdeaInterest: vi.fn(),
	removeIdeaInterest: vi.fn(),
}));

vi.mock("@/features/ideas/idea-validation-service", () => ({
	getIdeaValidationQuestion: vi.fn(),
	getIdeaValidationSummary: vi.fn(),
	saveIdeaValidationResponse: vi.fn(),
	removeIdeaValidationResponse: vi.fn(),
}));

const mockedGetPublishedIdea = vi.mocked(getPublishedIdea);
const mockedListPublishedIdeas = vi.mocked(listPublishedIdeas);
const idea = {
	id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
	slug: "solar-desalination-aaaaaaaa",
	title: "Solar desalination",
	summary: "Affordable clean water powered directly by sunlight.",
	description:
		"A modular desalination system designed for coastal communities.",
	status: "published" as const,
	published_at: "2026-08-09T00:00:00.000Z",
	created_at: "2026-08-08T00:00:00.000Z",
	category: { id: 1, slug: "technology", name: "Technology" },
	creator: {
		id: "11111111-1111-4111-8111-111111111111",
		username: "idea-creator-11111111",
		display_name: "Idea Creator",
		avatar_url: null,
	},
	media: [
		{
			id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
			kind: "image" as const,
			url: "https://example.com/solar.png",
			alt_text: "Solar desalination prototype",
			sort_order: 0,
		},
	],
};

function renderDetail(slug = idea.slug) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return render(
		<MemoryRouter initialEntries={[`/ideas/${slug}`]}>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path="/ideas/:slug" element={<IdeaDetailPage />} />
				</Routes>
			</QueryClientProvider>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.resetAllMocks();
	vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false });
	vi.mocked(getIdeaInterestSummary).mockResolvedValue({
		interestCount: 3,
		viewerHasInterest: false,
		viewerIntent: null,
	});
	vi.mocked(getIdeaValidationQuestion).mockResolvedValue(null);
	mockedListPublishedIdeas.mockResolvedValue([]);
});

afterEach(cleanup);

describe("IdeaDetailPage", () => {
	it("shows an accessible loading state", () => {
		mockedGetPublishedIdea.mockReturnValue(new Promise(() => undefined));

		renderDetail();

		expect(screen.getByRole("status")).toHaveTextContent(/loading idea/i);
	});

	it("renders the complete public idea and its media", async () => {
		mockedGetPublishedIdea.mockResolvedValue(idea);

		renderDetail();

		expect(
			await screen.findByRole("heading", { name: idea.title }),
		).toBeInTheDocument();
		expect(screen.getByText(idea.summary)).toBeInTheDocument();
		expect(screen.getByText(idea.description)).toBeInTheDocument();
		expect(screen.getByText("Technology")).toBeInTheDocument();
		expect(screen.getByText("Concept preview")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /idea creator/i })).toHaveAttribute(
			"href",
			`/profiles/${idea.creator.username}`,
		);
		expect(
			screen.getByRole("img", { name: /solar desalination prototype/i }),
		).toHaveAttribute("src", idea.media[0].url);
		expect(
			screen.getByRole("link", { name: /back to ideas/i }),
		).toHaveAttribute("href", "/ideas");
		expect(
			screen.getByRole("note", { name: /exploration mode/i }),
		).toHaveTextContent(/testing whether people want a place like this/i);
		expect(
			await screen.findByRole("heading", {
				name: /would you want to see this happen/i,
			}),
		).toBeInTheDocument();
		expect(screen.getByText(/3 people are interested/i)).toBeInTheDocument();
	});

	it("recommends other concepts in the same category without repeating the current idea", async () => {
		const relatedIdea = {
			...idea,
			id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
			slug: "private-ai-workbench",
			title: "Private AI Workbench",
			summary: "Search sensitive files with a local model.",
			interestCount: 2,
		};
		const unrelatedIdea = {
			...relatedIdea,
			id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
			slug: "clean-air-library",
			title: "The Clean Air Library",
			category: { id: 2, slug: "health", name: "Health" },
		};
		mockedGetPublishedIdea.mockResolvedValue(idea);
		mockedListPublishedIdeas.mockResolvedValue([
			{ ...idea, interestCount: 3 },
			relatedIdea,
			unrelatedIdea,
		]);

		renderDetail();

		const related = await screen.findByRole("region", {
			name: /more technology concepts/i,
		});
		expect(
			within(related).getByRole("link", { name: /view private ai workbench/i }),
		).toHaveAttribute("href", "/ideas/private-ai-workbench");
		expect(
			within(related).getByRole("link", {
				name: /browse all technology concepts/i,
			}),
		).toHaveAttribute("href", "/ideas?category=technology");
		expect(
			within(related).queryByRole("link", { name: /view solar desalination/i }),
		).not.toBeInTheDocument();
		expect(
			within(related).queryByText("The Clean Air Library"),
		).not.toBeInTheDocument();
	});

	it("renders a focused pilot question when the concept has one", async () => {
		mockedGetPublishedIdea.mockResolvedValue({
			...idea,
			id: "00000000-0000-4000-8000-000000000218",
			slug: "project-time-capsule",
			title: "Project Time Capsule",
		});
		vi.mocked(getIdeaValidationQuestion).mockResolvedValue({
			id: "00000000-0000-4000-8000-000000000401",
			prompt: "What could you bring to a first Project Time Capsule pilot?",
			viewerOptionId: null,
			options: [
				{
					id: "00000000-0000-4000-8000-000000000411",
					value: "open-source-project",
					label: "An open-source project I maintain",
				},
			],
		});

		renderDetail("project-time-capsule");

		expect(
			await screen.findByRole("region", {
				name: /what could you bring to a first project time capsule pilot/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /view pilot plan/i }),
		).toHaveAttribute("href", "/pilots/project-time-capsule");
	});

	it("renders safe video media as an external link", async () => {
		mockedGetPublishedIdea.mockResolvedValue({
			...idea,
			media: [
				{
					...idea.media[0],
					kind: "video",
					url: "https://example.com/solar-demo.mp4",
					alt_text: "Solar desalination demonstration",
				},
			],
		});

		renderDetail();

		const videoLink = await screen.findByRole("link", {
			name: /watch solar desalination demonstration/i,
		});
		expect(videoLink).toHaveAttribute(
			"href",
			"https://example.com/solar-demo.mp4",
		);
		expect(videoLink).toHaveAttribute("rel", "noreferrer");
	});

	it("does not render media with unsafe URLs", async () => {
		mockedGetPublishedIdea.mockResolvedValue({
			...idea,
			media: [{ ...idea.media[0], url: "javascript:alert('unsafe')" }],
		});

		renderDetail();

		expect(
			await screen.findByRole("heading", { name: idea.title }),
		).toBeInTheDocument();
		expect(screen.queryByRole("img")).not.toBeInTheDocument();
	});

	it("renders a not-found state for an unknown or draft slug", async () => {
		mockedGetPublishedIdea.mockResolvedValue(null);

		renderDetail("missing-idea");

		expect(
			await screen.findByRole("heading", { name: /idea not found/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /browse ideas/i })).toHaveAttribute(
			"href",
			"/ideas",
		);
	});

	it("shows a safe error state", async () => {
		mockedGetPublishedIdea.mockRejectedValue(
			new Error("sensitive database details"),
		);

		renderDetail();

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Unable to load this idea. Please try again.",
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(/sensitive/i);
	});
});
