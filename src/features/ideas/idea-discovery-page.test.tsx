import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IdeaDiscoveryPage } from "@/features/ideas/idea-discovery-page";
import { listPublishedIdeas } from "@/features/ideas/idea-discovery-service";

vi.mock("@/features/ideas/idea-discovery-service", () => ({
	listPublishedIdeas: vi.fn(),
}));

const mockedListPublishedIdeas = vi.mocked(listPublishedIdeas);
const idea = {
	id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
	slug: "solar-desalination-aaaaaaaa",
	title: "Solar desalination",
	summary: "Affordable clean water powered directly by sunlight.",
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

function renderDiscovery() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return render(
		<MemoryRouter>
			<QueryClientProvider client={queryClient}>
				<IdeaDiscoveryPage />
			</QueryClientProvider>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.resetAllMocks();
});

afterEach(cleanup);

describe("IdeaDiscoveryPage", () => {
	it("shows an accessible loading state", () => {
		mockedListPublishedIdeas.mockReturnValue(new Promise(() => undefined));

		renderDiscovery();

		expect(screen.getByRole("status")).toHaveTextContent(/loading ideas/i);
	});

	it("renders published idea cards with detail and creator links", async () => {
		mockedListPublishedIdeas.mockResolvedValue([idea]);

		renderDiscovery();

		expect(
			await screen.findByRole("heading", { name: /discover ideas/i }),
		).toBeInTheDocument();
		const ideaLink = await screen.findByRole("link", { name: idea.title });
		expect(ideaLink).toHaveAttribute("href", `/ideas/${idea.slug}`);
		expect(screen.getByText(idea.summary)).toBeInTheDocument();
		expect(screen.getByText("Technology")).toBeInTheDocument();
		expect(screen.getByText("Concept preview")).toBeInTheDocument();
		expect(
			screen.getByRole("img", { name: /solar desalination prototype/i }),
		).toHaveAttribute("src", idea.media[0].url);
		expect(screen.getByRole("link", { name: /idea creator/i })).toHaveAttribute(
			"href",
			`/profiles/${idea.creator.username}`,
		);
		expect(
			screen.getByRole("note", { name: /exploration mode/i }),
		).toHaveTextContent(/concept previews, not active fundraisers/i);
	});

	it("renders a useful empty state", async () => {
		mockedListPublishedIdeas.mockResolvedValue([]);

		renderDiscovery();

		expect(
			await screen.findByRole("heading", {
				name: /the first ideas are taking shape/i,
			}),
		).toBeInTheDocument();
		const startIdeaLinks = screen.getAllByRole("link", {
			name: /start an idea/i,
		});
		expect(startIdeaLinks).toHaveLength(2);
		for (const link of startIdeaLinks) {
			expect(link).toHaveAttribute("href", "/ideas/new");
		}
	});

	it("shows a safe error state", async () => {
		mockedListPublishedIdeas.mockRejectedValue(
			new Error("sensitive database details"),
		);

		renderDiscovery();

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Unable to load ideas. Please try again.",
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(/sensitive/i);
	});
});
