import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthPage } from "@/features/auth/auth-page";
import {
	signInWithEmail,
	signInWithOAuth,
	signUpWithEmail,
	type OAuthProvider,
} from "@/features/auth/auth-service";

vi.mock("@/features/auth/auth-service", () => ({
	signInWithEmail: vi.fn(),
	signUpWithEmail: vi.fn(),
	signInWithOAuth: vi.fn(),
}));

const mockedSignInWithEmail = vi.mocked(signInWithEmail);
const mockedSignUpWithEmail = vi.mocked(signUpWithEmail);
const mockedSignInWithOAuth = vi.mocked(signInWithOAuth);

function renderAuthPage(mode: "sign-in" | "sign-up") {
	return render(
		<MemoryRouter initialEntries={[`/${mode}`]}>
			<Routes>
				<Route path={`/${mode}`} element={<AuthPage mode={mode} />} />
				<Route path="/" element={<p>Home route</p>} />
			</Routes>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.resetAllMocks();
});

afterEach(cleanup);

describe("AuthPage", () => {
	it("signs in with an email and password, then navigates home", async () => {
		const user = userEvent.setup();
		mockedSignInWithEmail.mockResolvedValue();
		renderAuthPage("sign-in");

		await user.type(screen.getByLabelText(/email/i), "maker@example.com");
		await user.type(screen.getByLabelText(/password/i), "correct horse");
		await user.click(screen.getByRole("button", { name: /sign in/i }));

		expect(mockedSignInWithEmail).toHaveBeenCalledWith({
			email: "maker@example.com",
			password: "correct horse",
		});
		expect(await screen.findByText("Home route")).toBeInTheDocument();
	});

	it("requires credentials and disables submission while sign-in is pending", async () => {
		const user = userEvent.setup();
		let finishSignIn: (() => void) | undefined;
		mockedSignInWithEmail.mockImplementation(
			() =>
				new Promise<void>((resolve) => {
					finishSignIn = resolve;
				}),
		);
		renderAuthPage("sign-in");

		const email = screen.getByLabelText(/email/i);
		const password = screen.getByLabelText(/password/i);
		const submit = screen.getByRole("button", { name: /sign in/i });

		expect(email).toBeRequired();
		expect(password).toBeRequired();
		await user.type(email, "maker@example.com");
		await user.type(password, "correct horse");
		await user.click(submit);

		expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();
		finishSignIn?.();
		expect(await screen.findByText("Home route")).toBeInTheDocument();
	});

	it("shows a safe alert when sign-in fails", async () => {
		const user = userEvent.setup();
		mockedSignInWithEmail.mockRejectedValue(
			new Error("sensitive authentication details"),
		);
		renderAuthPage("sign-in");

		await user.type(screen.getByLabelText(/email/i), "maker@example.com");
		await user.type(screen.getByLabelText(/password/i), "wrong password");
		await user.click(screen.getByRole("button", { name: /sign in/i }));

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Unable to sign in. Please try again.",
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(
			"sensitive authentication details",
		);
	});

	it("shows the confirmation state when email sign-up has no session", async () => {
		const user = userEvent.setup();
		mockedSignUpWithEmail.mockResolvedValue({ hasSession: false });
		renderAuthPage("sign-up");

		await user.type(screen.getByLabelText(/email/i), "new-maker@example.com");
		await user.type(screen.getByLabelText(/password/i), "correct horse");
		await user.click(screen.getByRole("button", { name: /create account/i }));

		expect(mockedSignUpWithEmail).toHaveBeenCalledWith({
			email: "new-maker@example.com",
			password: "correct horse",
		});
		expect(
			await screen.findByRole("heading", { name: /check your email/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /back to sign in/i }),
		).toHaveAttribute("href", "/sign-in");
		expect(screen.queryByText("Home route")).not.toBeInTheDocument();
	});

	it("navigates home when email sign-up creates a session immediately", async () => {
		const user = userEvent.setup();
		mockedSignUpWithEmail.mockResolvedValue({ hasSession: true });
		renderAuthPage("sign-up");

		await user.type(screen.getByLabelText(/email/i), "new-maker@example.com");
		await user.type(screen.getByLabelText(/password/i), "correct horse");
		await user.click(screen.getByRole("button", { name: /create account/i }));

		expect(await screen.findByText("Home route")).toBeInTheDocument();
		expect(
			screen.queryByRole("heading", { name: /check your email/i }),
		).not.toBeInTheDocument();
	});

	it("links from sign-up mode back to sign-in", () => {
		renderAuthPage("sign-up");

		expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
			"href",
			"/sign-in",
		);
	});

	it.each<[string, OAuthProvider]>([
		["GitHub", "github"],
		["Google", "google"],
	])(
		"starts %s OAuth sign-in with the matching provider",
		async (name, provider) => {
			const user = userEvent.setup();
			mockedSignInWithOAuth.mockResolvedValue();
			renderAuthPage("sign-in");

			await user.click(
				screen.getByRole("button", {
					name: new RegExp(`continue with ${name}`, "i"),
				}),
			);

			expect(mockedSignInWithOAuth).toHaveBeenCalledWith(provider);
			expect(
				screen.queryByText(/signed in successfully/i),
			).not.toBeInTheDocument();
		},
	);

	it("shows an accessible alert when an OAuth provider fails", async () => {
		const user = userEvent.setup();
		mockedSignInWithOAuth.mockRejectedValue(
			new Error("provider is not enabled for this project"),
		);
		renderAuthPage("sign-in");

		await user.click(
			screen.getByRole("button", { name: /continue with github/i }),
		);

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Unable to continue with GitHub. Please try again.",
		);
		expect(
			screen.queryByText(/signed in successfully/i),
		).not.toBeInTheDocument();
	});
});
