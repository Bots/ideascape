import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	signInWithEmail,
	signInWithOAuth,
	signOut,
	signUpWithEmail,
} from "@/features/auth/auth-service";
import { getSupabaseClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
	getSupabaseClient: vi.fn(),
}));

const auth = {
	signInWithPassword: vi.fn(),
	signUp: vi.fn(),
	signInWithOAuth: vi.fn(),
	signOut: vi.fn(),
};

const credentials = {
	email: "creator@example.com",
	password: "correct-horse-battery-staple",
};
const callbackUrl = `${window.location.origin}/auth/callback`;

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(getSupabaseClient).mockReturnValue({
		auth,
	} as unknown as ReturnType<typeof getSupabaseClient>);
	auth.signInWithPassword.mockResolvedValue({ error: null });
	auth.signUp.mockResolvedValue({ data: { session: null }, error: null });
	auth.signInWithOAuth.mockResolvedValue({ error: null });
	auth.signOut.mockResolvedValue({ error: null });
});

describe("auth service", () => {
	it("signs in with email credentials", async () => {
		await signInWithEmail(credentials);

		expect(getSupabaseClient).toHaveBeenCalledOnce();
		expect(auth.signInWithPassword).toHaveBeenCalledWith(credentials);
	});

	it("reports when email sign-up needs confirmation", async () => {
		const outcome = await signUpWithEmail(credentials);

		expect(getSupabaseClient).toHaveBeenCalledOnce();
		expect(auth.signUp).toHaveBeenCalledWith({
			...credentials,
			options: { emailRedirectTo: callbackUrl },
		});
		expect(outcome).toEqual({ hasSession: false });
	});

	it("reports when email sign-up creates a session immediately", async () => {
		auth.signUp.mockResolvedValueOnce({
			data: { session: { access_token: "test-access-token" } },
			error: null,
		});

		const outcome = await signUpWithEmail(credentials);

		expect(outcome).toEqual({ hasSession: true });
	});

	it.each(["github", "google"] as const)(
		"signs in with the %s OAuth provider and callback redirect",
		async (provider) => {
			await signInWithOAuth(provider);

			expect(getSupabaseClient).toHaveBeenCalledOnce();
			expect(auth.signInWithOAuth).toHaveBeenCalledWith({
				provider,
				options: { redirectTo: callbackUrl },
			});
		},
	);

	it("signs out", async () => {
		await signOut();

		expect(getSupabaseClient).toHaveBeenCalledOnce();
		expect(auth.signOut).toHaveBeenCalledWith({ scope: "local" });
	});

	it("throws every error returned by Supabase", async () => {
		const error = new Error("Supabase request failed");
		const cases = [
			{
				request: () => signInWithEmail(credentials),
				mock: auth.signInWithPassword,
			},
			{ request: () => signUpWithEmail(credentials), mock: auth.signUp },
			{ request: () => signInWithOAuth("github"), mock: auth.signInWithOAuth },
			{ request: () => signOut(), mock: auth.signOut },
		];

		for (const testCase of cases) {
			testCase.mock.mockResolvedValueOnce({ error });

			await expect(testCase.request()).rejects.toBe(error);
		}
	});
});
