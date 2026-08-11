import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { useAuth } from "@/features/auth/auth-provider";
import { signUpWithEmail } from "@/features/auth/auth-service";

vi.mock("@/features/auth/auth-provider", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/features/auth/auth-service", () => ({
	signInWithEmail: vi.fn(),
	signUpWithEmail: vi.fn(),
	signInWithOAuth: vi.fn(),
	signOut: vi.fn(),
}));

vi.mock("@/features/admin/admin-service", () => ({
	getAdminAccess: vi.fn().mockResolvedValue(false),
}));

vi.mock("@/features/profiles/profile-page", () => ({
	ProfilePage: () => <h1>Public profile route</h1>,
}));

vi.mock("@/features/ideas/idea-editor-page", () => ({
	IdeaEditorPage: () => <h1>Idea editor route</h1>,
}));

vi.mock("@/features/ideas/idea-discovery-page", () => ({
	IdeaDiscoveryPage: () => <h1>Idea discovery route</h1>,
}));

vi.mock("@/features/ideas/idea-detail-page", () => ({
	IdeaDetailPage: () => <h1>Idea detail route</h1>,
}));

vi.mock("@/features/pilots/pilot-page", () => ({
	PilotPage: () => <h1>Pilot plan route</h1>,
}));

vi.mock("@/features/admin/admin-page", () => ({
	AdminPage: () => <h1>Admin dashboard route</h1>,
}));

function renderApp(path = "/") {
	return render(
		<MemoryRouter initialEntries={[path]}>
			<App />
		</MemoryRouter>,
	);
}

afterEach(cleanup);

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false });
});

describe("App", () => {
	it("introduces the Ideascape mission at the home route", () => {
		renderApp();
		const main = screen.getByRole("main");
		const banner = screen.getByRole("banner");
		expect(main).not.toContainElement(banner);

		expect(
			screen.getByRole("heading", {
				name: /great ideas deserve a place to grow/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText(/public workshop for early ideas/i),
		).toBeInTheDocument();
		expect(screen.getByText("Test the possibility")).toBeInTheDocument();
		expect(
			screen.getByText("Practical ideas, clearer next steps"),
		).toBeInTheDocument();
		expect(
			screen.getByText(/public interest and practical feedback/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/assumptions, permissions, boundaries/i),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
			"href",
			"/sign-in",
		);
		expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
			"href",
			"/sign-up",
		);
		expect(
			screen
				.getAllByRole("link", { name: /start an idea/i })
				.some((link) => link.getAttribute("href") === "/ideas/new"),
		).toBe(true);
		expect(
			screen.getByRole("link", { name: /explore ideas/i }),
		).toHaveAttribute("href", "/ideas");
		const explorationNote = screen.getByRole("note", {
			name: /exploration mode/i,
		});
		expect(explorationNote).toHaveTextContent(
			/testing whether people want a place like this/i,
		);
		expect(
			screen
				.getAllByRole("link", { name: /join the experiment/i })
				.every((link) => link.getAttribute("href") === "/sign-up"),
		).toBe(true);
		expect(screen.getByText("Concept previews")).toBeInTheDocument();
		expect(
			screen.getByText("Concept previews").nextElementSibling,
		).toHaveTextContent("27");
		expect(
			screen.getByText(
				/every preview names a threat scenario, control boundary, and proof required/i,
			),
		).toBeInTheDocument();
	});

	it("hides the join-the-experiment action from signed-in members", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: {
				id: "55555555-5555-4555-8555-555555555555",
				email: "member@example.com",
			} as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});

		renderApp();

		expect(
			screen.queryByRole("link", { name: /join the experiment/i }),
		).not.toBeInTheDocument();
	});

	it("spotlights a mix of practical community ideas", () => {
		renderApp();

		expect(
			screen.getByRole("link", { name: /browse by category/i }),
		).toHaveAttribute("href", "#idea-terrain-heading");
		expect(
			screen.getByRole("img", {
				name: /library room with portable air cleaners/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("img", {
				name: /storefront becomes an evening gallery/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText(/practical ideas, clearer next steps/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/cleaner air, safer streets, shared repair/i),
		).toBeInTheDocument();
	});

	it("presents broad community use cases without crypto-first framing", () => {
		renderApp();

		const main = screen.getByRole("main");
		expect(
			within(main).getByRole("heading", { name: /ideas for everyday life/i }),
		).toBeInTheDocument();
		expect(
			within(main).getByRole("heading", { name: /ways to take part/i }),
		).toBeInTheDocument();
		expect(
			within(main).getByRole("heading", { name: /proof before scale/i }),
		).toBeInTheDocument();
		for (const category of [
			"Arts & Culture",
			"Community",
			"Education",
			"Environment",
			"Health",
			"Technology",
		]) {
			expect(
				within(main).getByRole("heading", { name: category }),
			).toBeInTheDocument();
		}
		expect(main).toHaveTextContent(/no payments or fundraising/i);
		expect(main).not.toHaveTextContent(
			/smart.contract|crypto wallet|multisig|on.chain|seed phrase|funding rail/i,
		);
	});

	it("explains the current idea-validation flow", () => {
		renderApp();

		const howItWorks = screen.getByRole("region", {
			name: /how ideascape works/i,
		});
		const timelineItems = within(howItWorks).getAllByRole("article");
		expect(timelineItems).toHaveLength(10);
		expect(timelineItems[0].parentElement).toHaveClass(
			"md:grid-cols-2",
			"xl:grid-cols-5",
		);
		for (const [index, item] of timelineItems.entries()) {
			expect(item).toHaveTextContent(String(index + 1).padStart(2, "0"));
			expect(item).toHaveClass("md:even:border-r-0");
			expect(item).toHaveClass("xl:[&:nth-child(5n)]:border-r-0");
		}
		for (const nextStep of [
			"Shape the concept",
			"Map the threat scenario",
			"Set the control boundary",
			"Test public interest",
			"Turn signals into evidence",
			"Design a bounded pilot",
			"Challenge the security case",
			"Publish what happened",
			"Choose, repeat, or stop",
			"Leave a useful record",
		]) {
			expect(
				within(howItWorks).getByRole("heading", { name: nextStep }),
			).toBeInTheDocument();
		}
		expect(howItWorks).toHaveTextContent(/no payment or commitment/i);
		expect(
			within(howItWorks).getByRole("link", {
				name: /explore the live experiment/i,
			}),
		).toHaveAttribute("href", "/ideas");
	});

	it("shows concrete participation paths without implying transactions", () => {
		renderApp();

		const participation = screen.getByRole("region", {
			name: /ways to take part/i,
		});
		expect(participation).toHaveTextContent(/current invitation/i);
		expect(participation).toHaveTextContent(/no payments or fundraising/i);
		for (const path of [
			"Bring a question",
			"Signal what matters",
			"Add grounded context",
		]) {
			expect(
				within(participation).getByRole("heading", { name: path }),
			).toBeInTheDocument();
		}
	});

	it("explains the evidence and permission questions before expansion", () => {
		renderApp();

		const proof = screen.getByRole("region", {
			name: /proof before scale/i,
		});
		expect(proof).toHaveTextContent(/interest is a starting signal/i);
		for (const question of [
			"Whose problem is this?",
			"What is the smallest useful test?",
			"What must stay protected?",
			"What result changes the plan?",
		]) {
			expect(
				within(proof).getByRole("heading", { name: question }),
			).toBeInTheDocument();
		}
		expect(proof).toHaveTextContent(/nothing graduates automatically/i);
		expect(proof).toHaveTextContent(
			/never grants permission to use private data, property, accounts, or community identity/i,
		);
	});

	it("renders the sign-in route", async () => {
		renderApp("/sign-in");

		expect(
			await screen.findByRole("heading", { name: /^sign in$/i }),
		).toBeInTheDocument();
	});

	it("renders the sign-up route", async () => {
		renderApp("/sign-up");

		expect(
			await screen.findByRole("heading", { name: /create your account/i }),
		).toBeInTheDocument();
	});

	it("resets the form when moving from completed sign-up back to sign-in", async () => {
		const user = userEvent.setup();
		vi.mocked(signUpWithEmail).mockResolvedValue({ hasSession: false });
		renderApp("/sign-up");

		await user.type(
			await screen.findByLabelText(/email/i),
			"new-maker@example.com",
		);
		await user.type(screen.getByLabelText(/password/i), "secret password");
		await user.click(screen.getByRole("button", { name: /create account/i }));
		await user.click(
			await screen.findByRole("link", { name: /back to sign in/i }),
		);

		expect(
			screen.getByRole("heading", { name: /^sign in$/i }),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toHaveValue("");
		expect(screen.getByLabelText(/password/i)).toHaveValue("");
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
		expect(
			screen.queryByRole("heading", { name: /check your email/i }),
		).not.toBeInTheDocument();
	});

	it.each(["/ideas/new", "/ideas/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/edit"])(
		"renders the idea editor at %s",
		async (path) => {
			renderApp(path);

			expect(
				await screen.findByRole("heading", { name: /idea editor route/i }),
			).toBeInTheDocument();
		},
	);

	it("announces while a code-split route is loading", () => {
		renderApp("/ideas");

		expect(screen.getByRole("status")).toHaveTextContent(/loading page/i);
	});

	it("renders the public idea discovery route", async () => {
		renderApp("/ideas");

		expect(
			await screen.findByRole("heading", { name: /idea discovery route/i }),
		).toBeInTheDocument();
	});

	it("renders a public idea detail route", async () => {
		renderApp("/ideas/clean-air-library");

		expect(
			await screen.findByRole("heading", { name: /idea detail route/i }),
		).toBeInTheDocument();
	});

	it("renders the public pilot plan route", async () => {
		renderApp("/pilots/project-time-capsule");

		expect(
			await screen.findByRole("heading", { name: /pilot plan route/i }),
		).toBeInTheDocument();
	});

	it("renders the private admin dashboard route", async () => {
		renderApp("/admin");

		expect(
			await screen.findByRole("heading", { name: /admin dashboard route/i }),
		).toBeInTheDocument();
	});

	it("renders the public profile route", async () => {
		renderApp("/profiles/ada-lovelace-11111111");

		expect(
			await screen.findByRole("heading", { name: /public profile route/i }),
		).toBeInTheDocument();
	});

	it("renders the auth callback status and a way home", async () => {
		vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: true });
		renderApp("/auth/callback");

		expect(
			await screen.findByRole("heading", { name: /completing your sign-in/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /return home/i })).toHaveAttribute(
			"href",
			"/",
		);
	});
});
