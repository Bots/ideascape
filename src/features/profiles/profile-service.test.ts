import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPublicProfile } from "@/features/profiles/profile-service";
import { getSupabaseClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
	getSupabaseClient: vi.fn(),
}));

const maybeSingle = vi.fn();
const eq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq }));
const from = vi.fn(() => ({ select }));

const profile = {
	id: "11111111-1111-4111-8111-111111111111",
	username: "ada-lovelace-11111111",
	display_name: "Ada Lovelace",
	bio: "Building the analytical engine.",
	avatar_url: "https://example.com/ada.png",
	website: "https://example.com",
	created_at: "2026-08-09T00:00:00.000Z",
};

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(getSupabaseClient).mockReturnValue({
		from,
	} as unknown as ReturnType<typeof getSupabaseClient>);
	maybeSingle.mockResolvedValue({ data: profile, error: null });
});

describe("profile service", () => {
	it("loads a public profile by its exact username", async () => {
		await expect(getPublicProfile(profile.username)).resolves.toEqual(profile);

		expect(from).toHaveBeenCalledWith("profiles");
		expect(select).toHaveBeenCalledWith(
			"id, username, display_name, bio, avatar_url, website, created_at",
		);
		expect(eq).toHaveBeenCalledWith("username", profile.username);
		expect(maybeSingle).toHaveBeenCalledOnce();
	});

	it("returns null when the username does not exist", async () => {
		maybeSingle.mockResolvedValueOnce({ data: null, error: null });

		await expect(getPublicProfile("missing-profile")).resolves.toBeNull();
	});

	it("throws Supabase errors", async () => {
		const error = new Error("database details");
		maybeSingle.mockResolvedValueOnce({ data: null, error });

		await expect(getPublicProfile(profile.username)).rejects.toBe(error);
	});
});
