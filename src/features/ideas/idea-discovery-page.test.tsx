import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
	interestCount: 4,
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

const healthIdea = {
	...idea,
	id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
	slug: "neighborhood-cooling-lab",
	title: "Neighborhood Cooling Lab",
	summary: "Shared shade and heat-relief equipment for hotter neighborhoods.",
	category: { id: 2, slug: "health", name: "Health" },
	media: [],
};

function renderDiscovery(
	initialEntry = "/ideas",
	configureQueryClient?: (queryClient: QueryClient) => void,
) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	configureQueryClient?.(queryClient);

	return render(
		<MemoryRouter initialEntries={[initialEntry]}>
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
		expect(
			screen.queryByRole("link", { name: /^explore ideas$/i }),
		).not.toBeInTheDocument();
		const cardLink = await screen.findByRole("link", {
			name: `View ${idea.title}`,
		});
		expect(cardLink).toHaveAttribute("href", `/ideas/${idea.slug}`);
		expect(screen.getByText(idea.summary)).toBeInTheDocument();
		expect(screen.getAllByText("Technology").length).toBeGreaterThan(0);
		expect(screen.getByText("Concept preview")).toBeInTheDocument();
		expect(screen.getByText("1 demo concept")).toBeInTheDocument();
		expect(screen.getByText("4 people interested")).toBeInTheDocument();
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

	it("restores a category filter from the URL and only shows matching concepts", async () => {
		mockedListPublishedIdeas.mockResolvedValue([idea, healthIdea]);

		renderDiscovery("/ideas?category=technology");

		expect(
			await screen.findByRole("combobox", { name: /category/i }),
		).toHaveValue("technology");
		expect(
			screen.getByRole("link", { name: `View ${idea.title}` }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: `View ${healthIdea.title}` }),
		).not.toBeInTheDocument();
		expect(screen.getByText("Showing 1 of 2 concepts")).toBeInTheDocument();
	});

	it("restores search from the URL and offers a clear path when no concepts match", async () => {
		const user = userEvent.setup();
		mockedListPublishedIdeas.mockResolvedValue([idea, healthIdea]);

		renderDiscovery("/ideas?q=heat");

		const search = await screen.findByRole("searchbox", {
			name: /search concept previews/i,
		});
		expect(search).toHaveValue("heat");
		expect(
			screen.getByRole("link", { name: `View ${healthIdea.title}` }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: `View ${idea.title}` }),
		).not.toBeInTheDocument();

		await user.clear(search);
		await user.type(search, "unmatched phrase");

		expect(
			screen.getByRole("heading", { name: /no concepts match these filters/i }),
		).toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: /clear filters/i }));
		expect(search).toHaveValue("");
		expect(screen.getAllByRole("article")).toHaveLength(2);
	});

	it("encourages the first interest signal without implying funding", async () => {
		mockedListPublishedIdeas.mockResolvedValue([{ ...idea, interestCount: 0 }]);

		renderDiscovery();

		expect(
			await screen.findByText("Be first to signal interest"),
		).toBeInTheDocument();
		expect(screen.queryByText(/fund now/i)).not.toBeInTheDocument();
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
		expect(screen.getByText("Catalog unavailable")).toBeInTheDocument();
		expect(screen.getByRole("alert")).not.toHaveTextContent(/sensitive/i);
	});

	it("keeps a stale catalog coherent when a refresh fails", async () => {
		mockedListPublishedIdeas.mockRejectedValue(
			new Error("network unavailable"),
		);

		renderDiscovery("/ideas", (queryClient) => {
			queryClient.setQueryData(["published-ideas"], [idea]);
		});

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Unable to refresh ideas. Showing the latest available catalog.",
		);
		expect(screen.getByText("1 demo concept")).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: `View ${idea.title}` }),
		).toBeInTheDocument();
		expect(screen.queryByText("Catalog unavailable")).not.toBeInTheDocument();
	});
});
