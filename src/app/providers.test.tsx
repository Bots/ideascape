import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppProviders } from "@/app/providers";

vi.mock("@/features/auth/auth-provider", () => ({
	AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

beforeEach(() => {
	window.localStorage.clear();
	document.documentElement.classList.remove("dark");
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockReturnValue({
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		}),
	);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

describe("AppProviders", () => {
	it("makes the global theme control available across the application", () => {
		render(
			<AppProviders>
				<p>Application content</p>
			</AppProviders>,
		);

		expect(screen.getByText("Application content")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /switch to dark mode/i }),
		).toBeInTheDocument();
	});
});
