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
	it("introduces the focused security-bounty mission at the home route", () => {
		renderApp();
		const main = screen.getByRole("main");
		expect(main).not.toContainElement(screen.getByRole("banner"));
		expect(
			screen.getByRole("heading", {
				name: /test security with scope and proof/i,
			}),
		).toBeInTheDocument();
		expect(main).toHaveTextContent(
			/system owners publish authorized security bounties/i,
		);
		expect(main).toHaveTextContent(/written authorization is always separate/i);
		expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
			"href",
			"/sign-in",
		);
		expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
			"href",
			"/sign-up",
		);
		expect(
			screen.getByRole("link", { name: /browse security bounties/i }),
		).toHaveAttribute("href", "/ideas");
		expect(
			screen.getByRole("link", { name: /publish a bounty/i }),
		).toHaveAttribute("href", "/ideas/new");
		const rules = screen.getByRole("note", {
			name: /authorized bounty rules/i,
		});
		expect(rules).toHaveTextContent(/no authorization, no test/i);
		expect(rules).toHaveTextContent(/does not handle payouts/i);
	});

	it("hides the account-acquisition action from signed-in reviewers", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: {
				id: "55555555-5555-4555-8555-555555555555",
				email: "reviewer@example.com",
			} as ReturnType<typeof useAuth>["user"],
			isLoading: false,
		});
		renderApp();
		expect(
			screen.queryByRole("link", { name: /create an account/i }),
		).not.toBeInTheDocument();
	});

	it("presents one five-step security-bounty workflow", () => {
		renderApp();
		const workflow = screen.getByRole("region", {
			name: /from bounty to verified result/i,
		});
		const steps = within(workflow).getAllByRole("article");
		expect(steps).toHaveLength(5);
		for (const [index, title] of [
			"Publish the security bounty",
			"Define scope and proof",
			"Gather private readiness",
			"Run an authorized test",
			"Verify and close",
		].entries()) {
			expect(steps[index]).toHaveTextContent(
				String(index + 1).padStart(2, "0"),
			);
			expect(
				within(workflow).getByRole("heading", { name: title }),
			).toBeInTheDocument();
		}
	});

	it("presents six security areas with the same operating model", () => {
		renderApp();
		const main = screen.getByRole("main");
		expect(
			within(main).getByRole("heading", { name: /browse by system risk/i }),
		).toBeInTheDocument();
		for (const area of [
			"Provenance & Forgery",
			"Coordination & Resilience",
			"Human Attack Surface",
			"Physical & Sensor Systems",
			"Privacy & Safety",
			"Software & Compute",
		]) {
			expect(
				within(main).getByRole("heading", { name: area }),
			).toBeInTheDocument();
		}
		expect(main).not.toHaveTextContent(
			/crypto wallet|multisig|on.chain|seed phrase/i,
		);
	});

	it("makes the platform boundary explicit", () => {
		renderApp();
		const boundary = screen.getByRole("region", {
			name: /scope is visible. authorization stays separate/i,
		});
		expect(boundary).toHaveTextContent(/never grants access/i);
		expect(boundary).toHaveTextContent(
			/payments, escrow, or guaranteed rewards/i,
		);
		expect(boundary).toHaveTextContent(
			/private readiness signals as aggregate counts/i,
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
