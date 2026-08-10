import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
	resolve(process.cwd(), "src/index.css"),
	"utf8",
);
const appSource = readFileSync(resolve(process.cwd(), "src/App.tsx"), "utf8");
const interestPanelSource = readFileSync(
	resolve(process.cwd(), "src/features/ideas/idea-interest-panel.tsx"),
	"utf8",
);
const ideaDetailSource = readFileSync(
	resolve(process.cwd(), "src/features/ideas/idea-detail-page.tsx"),
	"utf8",
);
const pilotPageSource = readFileSync(
	resolve(process.cwd(), "src/features/pilots/pilot-page.tsx"),
	"utf8",
);
const appShell = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
const rootTheme = stylesheet.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const darkTheme = stylesheet.match(/\.dark\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

describe("civic field-notebook design system", () => {
	it("uses a deliberate editorial type family", () => {
		expect(stylesheet).toContain(
			'@import "@fontsource-variable/ibm-plex-sans"',
		);
		expect(stylesheet).toContain('@import "@fontsource/ibm-plex-mono/500.css"');
		expect(stylesheet).toContain(
			'--font-sans: "IBM Plex Sans Variable", sans-serif',
		);
		expect(stylesheet).toContain('--font-mono: "IBM Plex Mono", monospace');
	});

	it("pairs civic blue with a surveyor-orange signal color", () => {
		expect(rootTheme).toContain("--primary: oklch(0.51 0.19 252)");
		expect(rootTheme).toContain("--signal: oklch(0.56 0.18 48)");
		expect(rootTheme).toContain("--signal-foreground: oklch(0.99 0.004 248)");
		expect(rootTheme).toContain("--border: oklch(0.64 0.025 248)");
		expect(rootTheme).toContain("--input: oklch(0.64 0.025 248)");
		expect(rootTheme).toContain("--radius: 0.375rem");
		expect(darkTheme).toContain("--background: oklch(0.145 0.028 252)");
		expect(darkTheme).toContain("--primary: oklch(0.72 0.14 244)");
		expect(darkTheme).toContain("--signal: oklch(0.78 0.16 52)");
		expect(darkTheme).toContain("--border: oklch(0.5 0.04 252)");
		expect(darkTheme).toContain("--input: oklch(0.5 0.04 252)");
		expect(darkTheme).toContain("--ring: oklch(0.72 0.14 244)");
	});

	it("provides map-grid and contour-field composition primitives", () => {
		expect(stylesheet).toMatch(/\.field-grid\s*\{[\s\S]*background-image:/);
		expect(stylesheet).toMatch(
			/\.contour-field::before\s*\{[\s\S]*background-image:/,
		);
	});

	it("removes nonessential motion when the operating system requests it", () => {
		expect(stylesheet).toMatch(
			/@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*animation-duration:/,
		);
	});

	it("uses high-contrast signal colors on inverse and fixed-dark surfaces", () => {
		expect(appSource).toContain("border-l-[oklch(0.82_0.15_60)]");
		expect(appSource).toContain("text-[oklch(0.82_0.15_60)]");
		expect(pilotPageSource).toContain("border-t-[oklch(0.82_0.15_60)]");
		expect(pilotPageSource).toContain("text-[oklch(0.82_0.15_60)]");
		expect(interestPanelSource).toContain(
			"text-[oklch(0.82_0.15_60)] dark:text-[oklch(0.5_0.18_48)]",
		);
		expect(interestPanelSource).toContain("border-t-[oklch(0.82_0.15_60)]");
		expect(interestPanelSource).toContain("dark:border-t-[oklch(0.5_0.18_48)]");
		expect(ideaDetailSource).toContain(
			"text-[oklch(0.82_0.15_60)] dark:text-[oklch(0.5_0.18_48)]",
		);
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
