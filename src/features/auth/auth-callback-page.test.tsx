import { cleanup, render, screen } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthCallbackPage } from "@/features/auth/auth-callback-page";
import { useAuth } from "@/features/auth/auth-provider";

vi.mock("@/features/auth/auth-provider", () => ({
	useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

function renderCallback(path = "/auth/callback") {
	return render(
		<MemoryRouter initialEntries={[path]}>
			<AuthCallbackPage />
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.resetAllMocks();
});

afterEach(cleanup);

describe("AuthCallbackPage", () => {
	it("shows a pending state while the session is restoring", () => {
		mockedUseAuth.mockReturnValue({ user: null, isLoading: true });

		renderCallback();

		expect(
			screen.getByRole("heading", { name: /completing your sign-in/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("status")).toHaveTextContent(
			/session will be restored automatically/i,
		);
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});

	it("shows success when a session has been restored", () => {
		mockedUseAuth.mockReturnValue({
			user: { email: "maker@example.com" } as User,
			isLoading: false,
		});

		renderCallback();

		expect(
			screen.getByRole("heading", { name: /signed in successfully/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /continue home/i }),
		).toHaveAttribute("href", "/");
	});

	it.each([
		"/auth/callback?error=access_denied&error_description=sensitive-query-details",
		"/auth/callback#error=access_denied&error_description=sensitive-fragment-details",
	])("shows a safe failure for provider rejection at %s", (path) => {
		mockedUseAuth.mockReturnValue({ user: null, isLoading: false });

		renderCallback(path);

		expect(screen.getByRole("alert")).toHaveTextContent(
			"We couldn't complete your sign-in. Please try again.",
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(/sensitive/i);
		expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
			"href",
			"/sign-in",
		);
		expect(screen.getByRole("link", { name: /return home/i })).toHaveAttribute(
			"href",
			"/",
		);
	});

	it("shows a safe failure when restoration completes without a session", () => {
		mockedUseAuth.mockReturnValue({ user: null, isLoading: false });

		renderCallback();

		expect(screen.getByRole("alert")).toHaveTextContent(
			"We couldn't complete your sign-in. Please try again.",
		);
		expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
			"href",
			"/sign-in",
		);
		expect(screen.getByRole("link", { name: /return home/i })).toHaveAttribute(
			"href",
			"/",
		);
	});
});
