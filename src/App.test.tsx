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
				name: /pressure-test security before it ships/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText(/security validation lab for early systems/i),
		).toBeInTheDocument();
		expect(screen.getByText("Threats before trust")).toBeInTheDocument();
		expect(
			screen.getByText("Threats mapped. Controls bounded."),
		).toBeInTheDocument();
		expect(
			screen.getByText(/state what is authorized, excluded/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/precommit tests, stop conditions/i),
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
				.getAllByRole("link", { name: /draft a security brief/i })
				.some((link) => link.getAttribute("href") === "/ideas/new"),
		).toBe(true);
		expect(
			screen
				.getAllByRole("link", { name: /review security briefs/i })
				.every((link) => link.getAttribute("href") === "/ideas"),
		).toBe(true);
		const explorationNote = screen.getByRole("note", {
			name: /security review mode/i,
		});
		expect(explorationNote).toHaveTextContent(
			/security briefs, not deployment approvals/i,
		);
		expect(
			screen
				.getAllByRole("link", { name: /join the security review/i })
				.every((link) => link.getAttribute("href") === "/sign-up"),
		).toBe(true);
		expect(screen.getByText("Security briefs")).toBeInTheDocument();
		expect(
			screen.getByText("Security briefs").nextElementSibling,
		).toHaveTextContent("27");
		expect(
			screen.getByText(
				/every brief names a threat scenario, control boundary, and proof required/i,
			),
		).toBeInTheDocument();
	});

	it("hides the join-security-review action from signed-in operators", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: {
				id: "55555555-5555-4555-8555-555555555555",
				email: "member@example.com",
			} as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});

		renderApp();

		expect(
			screen.queryByRole("link", { name: /join the security review/i }),
		).not.toBeInTheDocument();
	});

	it("spotlights concrete security controls", () => {
		renderApp();

		expect(
			screen.getByRole("link", { name: /browse security domains/i }),
		).toHaveAttribute("href", "#idea-terrain-heading");
		expect(
			screen.getByRole("img", {
				name: /verifies signed dependencies/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("img", {
				name: /contained phishing drill/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText(/threats mapped. controls bounded/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/software, infrastructure, identity, human-risk/i),
		).toBeInTheDocument();
	});

	it("presents six security domains without transaction framing", () => {
		renderApp();

		const main = screen.getByRole("main");
		expect(
			within(main).getByRole("heading", {
				name: /security domains under review/i,
			}),
		).toBeInTheDocument();
		expect(
			within(main).getByRole("heading", { name: /ways to challenge a brief/i }),
		).toBeInTheDocument();
		expect(
			within(main).getByRole("heading", { name: /proof before scale/i }),
		).toBeInTheDocument();
		for (const category of [
			"Provenance & Authenticity",
			"Resilience & Response",
			"Human Risk",
			"Infrastructure Integrity",
			"Privacy & Safety",
			"Software & Systems",
		]) {
			expect(
				within(main).getByRole("heading", { name: category }),
			).toBeInTheDocument();
		}
		expect(main).toHaveTextContent(/never grants production access/i);
		expect(main).not.toHaveTextContent(
			/smart.contract|crypto wallet|multisig|on.chain|seed phrase|funding rail/i,
		);
	});

	it("explains the current idea-validation flow", () => {
		renderApp();

		const howItWorks = screen.getByRole("region", {
			name: /the security validation path/i,
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
			"Frame the system",
			"Map the threat scenario",
			"Set the control boundary",
			"Publish the security brief",
			"Collect validation signals",
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
		expect(howItWorks).toHaveTextContent(/deployment authority/i);
		expect(
			within(howItWorks).getByRole("link", {
				name: /review the security catalog/i,
			}),
		).toHaveAttribute("href", "/ideas");
	});

	it("shows concrete security-review paths without implying authority", () => {
		renderApp();

		const participation = screen.getByRole("region", {
			name: /ways to challenge a brief/i,
		});
		expect(participation).toHaveTextContent(/current security review/i);
		expect(participation).toHaveTextContent(/never grants production access/i);
		for (const path of [
			"Submit a system",
			"Challenge a control",
			"Contribute evidence",
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
		expect(proof).toHaveTextContent(
			/validation signal is not permission to deploy/i,
		);
		for (const question of [
			"What can fail or be abused?",
			"What authority is excluded?",
			"How does the control fail safely?",
			"What evidence earns trust?",
		]) {
			expect(
				within(proof).getByRole("heading", { name: question }),
			).toBeInTheDocument();
		}
		expect(proof).toHaveTextContent(/nothing advances automatically/i);
		expect(proof).toHaveTextContent(
			/never grants permission to use private data, property, accounts, or production systems/i,
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
