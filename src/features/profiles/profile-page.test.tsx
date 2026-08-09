import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProfilePage } from "@/features/profiles/profile-page";
import {
	getPublicProfile,
	type PublicProfile,
} from "@/features/profiles/profile-service";

vi.mock("@/features/profiles/profile-service", () => ({
	getPublicProfile: vi.fn(),
}));

const mockedGetPublicProfile = vi.mocked(getPublicProfile);

const profile: PublicProfile = {
	id: "11111111-1111-4111-8111-111111111111",
	username: "ada-lovelace-11111111",
	display_name: "Ada Lovelace",
	bio: "Building the analytical engine.",
	avatar_url: "https://example.com/ada.png",
	website: "https://example.com",
	created_at: "2026-08-09T00:00:00.000Z",
};

function renderProfilePage(username = profile.username) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return render(
		<MemoryRouter initialEntries={[`/profiles/${username}`]}>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path="/profiles/:username" element={<ProfilePage />} />
				</Routes>
			</QueryClientProvider>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.resetAllMocks();
});

afterEach(cleanup);

describe("ProfilePage", () => {
	it("shows an accessible loading state", () => {
		mockedGetPublicProfile.mockReturnValue(new Promise(() => undefined));

		renderProfilePage();

		expect(screen.getByRole("status")).toHaveTextContent(/loading profile/i);
	});

	it("renders a public profile", async () => {
		mockedGetPublicProfile.mockResolvedValue(profile);

		renderProfilePage();

		expect(
			await screen.findByRole("heading", { name: "Ada Lovelace" }),
		).toBeInTheDocument();
		expect(screen.getByText(`@${profile.username}`)).toBeInTheDocument();
		expect(screen.getByText(profile.bio ?? "")).toBeInTheDocument();
		expect(screen.getByRole("img", { name: /ada lovelace/i })).toHaveAttribute(
			"src",
			profile.avatar_url,
		);
		expect(
			screen.getByRole("link", { name: /visit website/i }),
		).toHaveAttribute("href", new URL(profile.website ?? "").href);
	});

	it("does not render unsafe avatar or website URLs", async () => {
		mockedGetPublicProfile.mockResolvedValue({
			...profile,
			avatar_url: "javascript:alert('avatar')",
			website: "javascript:alert('website')",
		});

		renderProfilePage();

		expect(
			await screen.findByRole("heading", { name: "Ada Lovelace" }),
		).toBeInTheDocument();
		expect(screen.queryByRole("img")).not.toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: /visit website/i }),
		).not.toBeInTheDocument();
	});

	it("renders a not-found state for an unknown username", async () => {
		mockedGetPublicProfile.mockResolvedValue(null);

		renderProfilePage("unknown-member");

		expect(
			await screen.findByRole("heading", { name: /profile not found/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /return home/i })).toHaveAttribute(
			"href",
			"/",
		);
	});

	it("shows a safe error without exposing provider details", async () => {
		mockedGetPublicProfile.mockRejectedValue(
			new Error("sensitive database connection details"),
		);

		renderProfilePage();

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Unable to load this profile. Please try again.",
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(/sensitive/i);
	});
});
