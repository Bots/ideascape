import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "@supabase/supabase-js";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/auth-provider";
import { AuthNavigation } from "@/features/auth/auth-navigation";
import { signOut } from "@/features/auth/auth-service";

vi.mock("@/features/auth/auth-provider", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/features/auth/auth-service", () => ({
	signOut: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedSignOut = vi.mocked(signOut);

function renderNavigation() {
	return render(
		<MemoryRouter>
			<AuthNavigation />
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.resetAllMocks();
});

afterEach(cleanup);

describe("AuthNavigation", () => {
	it("shows sign-in and sign-up links to anonymous users", () => {
		mockedUseAuth.mockReturnValue({ user: null, isLoading: false });
		renderNavigation();

		expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
			"href",
			"/sign-in",
		);
		expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
			"href",
			"/sign-up",
		);
	});

	it("shows the user email and sign-out control to authenticated users", () => {
		mockedUseAuth.mockReturnValue({
			user: { email: "maker@example.com" } as User,
			isLoading: false,
		});
		renderNavigation();

		expect(screen.getByText("maker@example.com")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /sign out/i }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: /sign in/i }),
		).not.toBeInTheDocument();
	});

	it("shows only a restoration status while the session is loading", () => {
		mockedUseAuth.mockReturnValue({ user: null, isLoading: true });
		renderNavigation();

		expect(screen.getByRole("status")).toHaveTextContent(/restoring session/i);
		expect(
			screen.queryByRole("link", { name: /sign in/i }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: /sign up/i }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /sign out/i }),
		).not.toBeInTheDocument();
	});

	it("signs out authenticated users", async () => {
		const user = userEvent.setup();
		mockedUseAuth.mockReturnValue({
			user: { email: "maker@example.com" } as User,
			isLoading: false,
		});
		mockedSignOut.mockResolvedValue();
		renderNavigation();

		await user.click(screen.getByRole("button", { name: /sign out/i }));

		expect(mockedSignOut).toHaveBeenCalledOnce();
	});

	it("shows a safe accessible alert when sign-out fails", async () => {
		const user = userEvent.setup();
		mockedUseAuth.mockReturnValue({
			user: { email: "maker@example.com" } as User,
			isLoading: false,
		});
		mockedSignOut.mockRejectedValue(new Error("sensitive session details"));
		renderNavigation();

		await user.click(screen.getByRole("button", { name: /sign out/i }));

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Unable to sign out. Please try again.",
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(
			"sensitive session details",
		);
	});
});
