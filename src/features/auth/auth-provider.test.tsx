import { act, cleanup, render, screen } from "@testing-library/react";
import type {
	AuthChangeEvent,
	Session,
	SupabaseClient,
	User,
} from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "@/features/auth/auth-provider";

function AuthConsumer() {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return <p>loading</p>;
	}

	return <p>{user?.email ?? "anonymous"}</p>;
}

function createUser(email: string): User {
	return { email } as User;
}

function createSession(user: User): Session {
	return { user } as Session;
}

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe("AuthProvider", () => {
	it("starts loading and restores the current session", async () => {
		const user = createUser("creator@example.com");
		const auth = {
			getSession: vi.fn().mockResolvedValue({
				data: { session: createSession(user) },
				error: null,
			}),
			onAuthStateChange: vi.fn().mockReturnValue({
				data: { subscription: { unsubscribe: vi.fn() } },
			}),
		};
		const client = { auth } as unknown as SupabaseClient;

		render(
			<AuthProvider client={client}>
				<AuthConsumer />
			</AuthProvider>,
		);

		expect(screen.getByText("loading")).toBeInTheDocument();
		expect(await screen.findByText(user.email ?? "")).toBeInTheDocument();
		expect(auth.getSession).toHaveBeenCalledOnce();
	});

	it("updates the user when the authentication state changes", async () => {
		const user = createUser("new-creator@example.com");
		const session = createSession(user);
		let handleAuthChange:
			| ((event: AuthChangeEvent, session: Session | null) => void)
			| undefined;
		const auth = {
			getSession: vi.fn().mockResolvedValue({
				data: { session: null },
				error: null,
			}),
			onAuthStateChange: vi.fn().mockImplementation((callback) => {
				handleAuthChange = callback;
				return { data: { subscription: { unsubscribe: vi.fn() } } };
			}),
		};
		const client = { auth } as unknown as SupabaseClient;

		render(
			<AuthProvider client={client}>
				<AuthConsumer />
			</AuthProvider>,
		);

		expect(await screen.findByText("anonymous")).toBeInTheDocument();
		expect(auth.onAuthStateChange).toHaveBeenCalledOnce();

		act(() => {
			handleAuthChange?.("SIGNED_IN", session);
		});

		expect(screen.getByText(user.email ?? "")).toBeInTheDocument();
	});

	it("unsubscribes from authentication changes when unmounted", () => {
		const unsubscribe = vi.fn();
		const auth = {
			getSession: vi.fn().mockResolvedValue({
				data: { session: null },
				error: null,
			}),
			onAuthStateChange: vi.fn().mockReturnValue({
				data: { subscription: { unsubscribe } },
			}),
		};
		const client = { auth } as unknown as SupabaseClient;
		const { unmount } = render(
			<AuthProvider client={client}>
				<AuthConsumer />
			</AuthProvider>,
		);

		unmount();

		expect(unsubscribe).toHaveBeenCalledOnce();
	});

	it("becomes anonymous when restoring the session fails", async () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		const auth = {
			getSession: vi
				.fn()
				.mockRejectedValue(new Error("sensitive provider failure details")),
			onAuthStateChange: vi.fn().mockReturnValue({
				data: { subscription: { unsubscribe: vi.fn() } },
			}),
		};
		const client = { auth } as unknown as SupabaseClient;

		render(
			<AuthProvider client={client}>
				<AuthConsumer />
			</AuthProvider>,
		);

		expect(await screen.findByText("anonymous")).toBeInTheDocument();
		expect(consoleError).toHaveBeenCalledWith(
			"Unable to restore the authentication session.",
		);
	});
});
