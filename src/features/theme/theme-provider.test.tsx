import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/features/theme/theme-provider";
import { ThemeToggle } from "@/features/theme/theme-toggle";

function renderTheme() {
	return render(
		<ThemeProvider>
			<ThemeToggle />
		</ThemeProvider>,
	);
}

beforeEach(() => {
	window.localStorage.clear();
	document.documentElement.classList.remove("dark");
	const themeColor = document.createElement("meta");
	themeColor.name = "theme-color";
	document.head.append(themeColor);
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
	document.querySelector('meta[name="theme-color"]')?.remove();
	vi.unstubAllGlobals();
});

describe("theme controls", () => {
	it("restores a saved dark theme before presenting the toggle", () => {
		window.localStorage.setItem("ideascape.theme", "dark");

		renderTheme();

		expect(document.documentElement).toHaveClass("dark");
		expect(
			screen.getByRole("button", { name: /switch to light mode/i }),
		).toBeInTheDocument();
		expect(document.documentElement.style.colorScheme).toBe("dark");
		expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
			"content",
			"#050505",
		);
	});

	it("toggles and persists the visitor theme", async () => {
		const user = userEvent.setup();
		renderTheme();

		await user.click(
			screen.getByRole("button", { name: /switch to dark mode/i }),
		);

		expect(document.documentElement).toHaveClass("dark");
		expect(window.localStorage.getItem("ideascape.theme")).toBe("dark");
		expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
			"content",
			"#050505",
		);
	});

	it("reports the bone light canvas when light mode is active", () => {
		renderTheme();

		expect(document.documentElement).not.toHaveClass("dark");
		expect(document.documentElement.style.colorScheme).toBe("light");
		expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
			"content",
			"#f2efe6",
		);
	});

	it("uses the operating-system preference when no choice is saved", () => {
		vi.mocked(window.matchMedia).mockReturnValue({
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		} as unknown as MediaQueryList);

		renderTheme();

		expect(document.documentElement).toHaveClass("dark");
	});
});
