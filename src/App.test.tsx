import { cleanup, render, screen } from "@testing-library/react";
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

		expect(
			screen.getByRole("heading", {
				name: /great ideas deserve a place to grow/i,
			}),
		).toBeInTheDocument();
		expect(screen.getByText(/community funding platform/i)).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
			"href",
			"/sign-in",
		);
		expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
			"href",
			"/sign-up",
		);
		expect(
			screen.getByRole("link", { name: /start an idea/i }),
		).toHaveAttribute("href", "/ideas/new");
		expect(
			screen.getByRole("link", { name: /explore ideas/i }),
		).toHaveAttribute("href", "/ideas");
	});

	it("renders the sign-in route", () => {
		renderApp("/sign-in");

		expect(
			screen.getByRole("heading", { name: /^sign in$/i }),
		).toBeInTheDocument();
	});

	it("renders the sign-up route", () => {
		renderApp("/sign-up");

		expect(
			screen.getByRole("heading", { name: /create your account/i }),
		).toBeInTheDocument();
	});

	it("resets the form when moving from completed sign-up back to sign-in", async () => {
		const user = userEvent.setup();
		vi.mocked(signUpWithEmail).mockResolvedValue({ hasSession: false });
		renderApp("/sign-up");

		await user.type(screen.getByLabelText(/email/i), "new-maker@example.com");
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
		(path) => {
			renderApp(path);

			expect(
				screen.getByRole("heading", { name: /idea editor route/i }),
			).toBeInTheDocument();
		},
	);

	it("renders the public idea discovery route", () => {
		renderApp("/ideas");

		expect(
			screen.getByRole("heading", { name: /idea discovery route/i }),
		).toBeInTheDocument();
	});

	it("renders a public idea detail route", () => {
		renderApp("/ideas/clean-air-library");

		expect(
			screen.getByRole("heading", { name: /idea detail route/i }),
		).toBeInTheDocument();
	});

	it("renders the public profile route", () => {
		renderApp("/profiles/ada-lovelace-11111111");

		expect(
			screen.getByRole("heading", { name: /public profile route/i }),
		).toBeInTheDocument();
	});

	it("renders the auth callback status and a way home", () => {
		vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: true });
		renderApp("/auth/callback");

		expect(
			screen.getByRole("heading", { name: /completing your sign-in/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /return home/i })).toHaveAttribute(
			"href",
			"/",
		);
	});
});
