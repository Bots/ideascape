import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
	resolve(process.cwd(), "src/index.css"),
	"utf8",
);
const appShell = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
const darkTheme = stylesheet.match(/\.dark\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

describe("dark theme design tokens", () => {
	it("keeps the orange identity on warm high-contrast surfaces", () => {
		expect(darkTheme).toContain("--background: oklch(0.17 0.025 43)");
		expect(darkTheme).toContain("--card: oklch(0.215 0.03 44)");
		expect(darkTheme).toContain("--primary: oklch(0.72 0.19 43)");
		expect(darkTheme).toContain("--ring: oklch(0.72 0.19 43)");
	});

	it("uses a restrained dark-mode ambient background", () => {
		expect(stylesheet).toMatch(/\.dark body\s*\{[\s\S]*background-image:/);
	});

	it("sets the saved or system theme before the application loads", () => {
		expect(appShell).toContain("ideascape.theme");
		expect(appShell).toContain("prefers-color-scheme: dark");
		expect(appShell).toContain('classList.add("dark")');
	});

	it("describes the landing page as a possibility test", () => {
		expect(appShell).toContain(
			"<title>Ideascape — Test the possibility</title>",
		);
	});
});
