import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IdeaDetailPage } from "@/features/ideas/idea-detail-page";
import { getPublishedIdea } from "@/features/ideas/idea-discovery-service";

vi.mock("@/features/ideas/idea-discovery-service", () => ({
	getPublishedIdea: vi.fn(),
}));

const mockedGetPublishedIdea = vi.mocked(getPublishedIdea);
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
