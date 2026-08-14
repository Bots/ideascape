import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/site-header";

afterEach(cleanup);

describe("SiteHeader", () => {
	it("provides a consistent brand, primary navigation, and account area", () => {
		render(
			<MemoryRouter>
				<SiteHeader account={<span>Account controls</span>} />
			</MemoryRouter>,
		);

		expect(
			screen.getByRole("link", { name: /ideascape home/i }),
		).toHaveAttribute("href", "/");
		expect(screen.getByText("IdeaScape", { exact: true })).toBeInTheDocument();
		expect(screen.queryByText(/channel open/i)).not.toBeInTheDocument();
		expect(
			screen.getByText("Authorized security bounties", { exact: true }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /security bounties/i }),
		).toHaveAttribute("href", "/ideas");
		const startIdeaLink = screen.getByRole("link", {
			name: /publish a bounty/i,
		});
		expect(startIdeaLink).toHaveAttribute("href", "/ideas/new");
		expect(startIdeaLink).toHaveClass("bg-signal");
		expect(screen.getByText(/account controls/i)).toBeInTheDocument();
	});

	it("does not require provider-aware account controls", () => {
		render(
			<MemoryRouter>
				<SiteHeader />
			</MemoryRouter>,
		);

		expect(screen.queryByText(/account controls/i)).not.toBeInTheDocument();
	});

	it("omits the primary navigation landmark when it has no links", () => {
		render(
			<MemoryRouter>
				<SiteHeader showExplore={false} showStartIdea={false} />
			</MemoryRouter>,
		);

		expect(
			screen.queryByRole("navigation", { name: /primary/i }),
		).not.toBeInTheDocument();
	});
});
