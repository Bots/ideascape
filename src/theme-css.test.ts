import { readdirSync, readFileSync } from "node:fs";
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
const ideaDiscoverySource = readFileSync(
	resolve(process.cwd(), "src/features/ideas/idea-discovery-page.tsx"),
	"utf8",
);
const profilePageSource = readFileSync(
	resolve(process.cwd(), "src/features/profiles/profile-page.tsx"),
	"utf8",
);
const pilotPageSource = readFileSync(
	resolve(process.cwd(), "src/features/pilots/pilot-page.tsx"),
	"utf8",
);
const appShell = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
const rootTheme = stylesheet.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const darkTheme = stylesheet.match(/\.dark\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

const allowedPalette = new Set([
	"#000000",
	"#050505",
	"#0a0a0a",
	"#0a0a09",
	"#0f0f0d",
	"#11110f",
	"#171714",
	"#171717",
	"#201108",
	"#24231f",
	"#262626",
	"#3e3c37",
	"#404040",
	"#525252",
	"#625f58",
	"#737373",
	"#aaa79f",
	"#a3a3a3",
	"#d4d4d4",
	"#e5e5e5",
	"#f5f5f5",
	"#f2efe6",
	"#fafafa",
	"#ffffff",
	"#ff5a1f",
	"#ffb091",
]);

const prohibitedNamedColors = new RegExp(
	`\\b(?:${[
		"aliceblue",
		"antiquewhite",
		"aqua",
		"aquamarine",
		"azure",
		"beige",
		"bisque",
		"blanchedalmond",
		"blue",
		"blueviolet",
		"brown",
		"burlywood",
		"cadetblue",
		"chartreuse",
		"chocolate",
		"coral",
		"cornflowerblue",
		"cornsilk",
		"crimson",
		"cyan",
		"darkblue",
		"darkcyan",
		"darkgoldenrod",
		"darkgreen",
		"darkkhaki",
		"darkmagenta",
		"darkolivegreen",
		"darkorange",
		"darkorchid",
		"darkred",
		"darksalmon",
		"darkseagreen",
		"darkslateblue",
		"darkturquoise",
		"darkviolet",
		"deeppink",
		"deepskyblue",
		"dodgerblue",
		"firebrick",
		"floralwhite",
		"forestgreen",
		"fuchsia",
		"ghostwhite",
		"gold",
		"goldenrod",
		"green",
		"greenyellow",
		"honeydew",
		"hotpink",
		"indianred",
		"indigo",
		"ivory",
		"khaki",
		"lavender",
		"lavenderblush",
		"lawngreen",
		"lemonchiffon",
		"lightblue",
		"lightcoral",
		"lightcyan",
		"lightgoldenrodyellow",
		"lightgreen",
		"lightpink",
		"lightsalmon",
		"lightseagreen",
		"lightskyblue",
		"lightslategray",
		"lightslategrey",
		"lightsteelblue",
		"lightyellow",
		"lime",
		"limegreen",
		"linen",
		"magenta",
		"maroon",
		"mediumaquamarine",
		"mediumblue",
		"mediumorchid",
		"mediumpurple",
		"mediumseagreen",
		"mediumslateblue",
		"mediumspringgreen",
		"mediumturquoise",
		"mediumvioletred",
		"midnightblue",
		"mintcream",
		"mistyrose",
		"moccasin",
		"navajowhite",
		"navy",
		"oldlace",
		"olive",
		"olivedrab",
		"orange",
		"orangered",
		"orchid",
		"palegoldenrod",
		"palegreen",
		"paleturquoise",
		"palevioletred",
		"papayawhip",
		"peachpuff",
		"peru",
		"pink",
		"plum",
		"powderblue",
		"purple",
		"rebeccapurple",
		"red",
		"rosybrown",
		"royalblue",
		"saddlebrown",
		"salmon",
		"sandybrown",
		"seagreen",
		"seashell",
		"sienna",
		"skyblue",
		"slateblue",
		"snow",
		"springgreen",
		"steelblue",
		"tan",
		"teal",
		"thistle",
		"tomato",
		"turquoise",
		"violet",
		"wheat",
		"yellow",
		"yellowgreen",
		"accentcolor",
		"activetext",
		"highlight",
		"linktext",
		"mark",
		"selecteditem",
		"visitedtext",
	].join("|")})\\b`,
	"gi",
);

function listVisualSourceFiles(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = resolve(directory, entry.name);
		if (entry.isDirectory()) {
			return listVisualSourceFiles(path);
		}
		if (/\.test\.[jt]sx?$/.test(entry.name)) {
			return [];
		}
		return /\.(?:css|html|svg|tsx?)$/.test(entry.name) ? [path] : [];
	});
}

function findPaletteViolations(source: string): string[] {
	const hexColors = source.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
	const disallowedHex = hexColors.filter((color) => {
		const normalized = color.toLowerCase();
		const expanded = /^#[0-9a-f]{3}$/.test(normalized)
			? `#${[...normalized.slice(1)].map((digit) => digit.repeat(2)).join("")}`
			: normalized;
		return !allowedPalette.has(expanded);
	});
	const arbitraryColorFunctions = [
		...(source.match(
			/\b(?:oklch|oklab|lch|lab|rgba|hsla?|hwb|color|device-cmyk|light-dark|contrast-color|color-contrast)\s*\(/gi,
		) ?? []),
		...(source.match(/\brgb\([^)]*\)/gi) ?? [])
			.filter(
				(value) => !/rgb\((?:255 90 31|242 239 230) \/ 0\.\d+\)/i.test(value),
			)
			.map(() => "rgb("),
	];
	const namedColorUtilities =
		source.match(
			/\b(?:red|green|blue|yellow|amber|orange|lime|emerald|cyan|sky|indigo|violet|purple|fuchsia|pink|rose|teal|slate|stone|zinc|gray)-\d{2,3}\b/gi,
		) ?? [];
	const allowedNamedColors = new Set([
		"auto",
		"black",
		"currentcolor",
		"gray",
		"grey",
		"inherit",
		"initial",
		"none",
		"revert",
		"revert-layer",
		"transparent",
		"unset",
		"white",
	]);
	const directCssColorNames = [
		...source.matchAll(
			/\b(?:color|background(?:-color)?|border(?:-(?:top|right|bottom|left))?-color|outline-color|fill|stroke|text-decoration-color|caret-color|accent-color)\s*:\s*([a-z][a-z0-9-]*)\s*(?=[;},])/gi,
		),
		...source.matchAll(
			/\b(?:color|backgroundColor|borderColor|outlineColor|fill|stroke|textDecorationColor|caretColor|accentColor)\s*:\s*["']([a-z][a-z0-9-]*)["']/gi,
		),
		...source.matchAll(/\b(?:color|fill|stroke)=["']([a-z][a-z0-9-]*)["']/gi),
	]
		.map((match) => match[1])
		.filter((color) => !allowedNamedColors.has(color.toLowerCase()));
	const arbitraryNamedColorUtilities = [
		...source.matchAll(
			/\b(?:bg|text|border|outline|ring|fill|stroke|decoration|caret|accent)-\[([a-z][a-z0-9-]*)\]/gi,
		),
	]
		.map((match) => match[1])
		.filter((color) => !allowedNamedColors.has(color.toLowerCase()));
	const prohibitedColorKeywords = source.match(prohibitedNamedColors) ?? [];
	const signalColorMixes =
		source.match(
			/color-mix\([^)]*(?:#ff5a1f|var\(--(?:signal|ring)\))[^)]*\)/gi,
		) ?? [];
	const colorChangingFilters =
		source.match(/\b(?:hue-rotate|invert|sepia)\(\s*[^)]*/gi) ?? [];
	const translucentSignalUtilities =
		source.match(
			/\b(?:bg|text|border|outline|ring|fill|stroke|decoration|caret|accent)-(?:signal|ring|\[#ff5a1f\])\/(?:\d+|\[[^\]]+\])/gi,
		) ?? [];
	return [
		...disallowedHex,
		...arbitraryColorFunctions,
		...namedColorUtilities,
		...directCssColorNames,
		...arbitraryNamedColorUtilities,
		...prohibitedColorKeywords,
		...signalColorMixes,
		...colorChangingFilters,
		...translucentSignalUtilities,
	];
}

describe("security-bounty field system", () => {
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

	it("uses distinct bone-light and black-dark monochrome-orange themes", () => {
		expect(rootTheme).toContain("--background: #f2efe6");
		expect(rootTheme).toContain("--foreground: #050505");
		expect(rootTheme).toContain("--signal: #ff5a1f");
		expect(rootTheme).toContain("--signal-foreground: #050505");
		expect(darkTheme).toContain("--background: #050505");
		expect(darkTheme).toContain("--card: #0a0a09");
		expect(darkTheme).toContain("--popover: #0a0a09");
		expect(darkTheme).toContain("--sidebar: #050505");
		expect(darkTheme).toContain("--foreground: #f2efe6");
		expect(darkTheme).toContain("--primary: #f2efe6");
		expect(darkTheme).toContain("--signal: #ff5a1f");
		expect(darkTheme).toContain("--destructive: #ff5a1f");
		expect(darkTheme).toContain("--border: #3e3c37");
		expect(darkTheme).toContain("--input: #625f58");
		expect(darkTheme).toContain("--radius: 0");
		expect(rootTheme).not.toBe(darkTheme);
	});

	it("keeps every production color inside the monochrome-orange palette", () => {
		const files = [
			...listVisualSourceFiles(resolve(process.cwd(), "src")),
			resolve(process.cwd(), "public/favicon.svg"),
			resolve(process.cwd(), "index.html"),
		];
		const violations = files.flatMap((file) => {
			const source = readFileSync(file, "utf8");
			return findPaletteViolations(source).map(
				(color) => `${file.replace(`${process.cwd()}/`, "")}: ${color}`,
			);
		});

		expect(violations).toEqual([]);
	});

	it("rejects named, arbitrary, case-varied, and color-space bypasses", () => {
		const utilityFixtures = [
			["bg", "orange-500"].join("-"),
			["bg", "zinc-500"].join("-"),
			["text", "[rebeccapurple]"].join("-"),
			["bg", "signal/50"].join("-"),
			["text", "signal/[.5]"].join("-"),
			["border", "[#ff5a1f]/50"].join("-"),
		];
		const violations = findPaletteViolations(
			`color: AQUA; background: coral; fill: chartreuse; border: 1px solid tomato; COLOR(SRGB-LINEAR 1 0.2 0); LAB(-5 20 20); rgb(var(--channels)); rgb(from #ff5a1f r g b / 50%); color: "navy"; <path fill="gold" />; filter: HUE-ROTATE(20deg); color: color-mix(in srgb,var(--signal),white); ${utilityFixtures.join(" ")}`,
		).map((violation) => violation.toLowerCase());

		expect(violations).toEqual(
			expect.arrayContaining([
				"orange-500",
				"zinc-500",
				"rebeccapurple",
				...utilityFixtures.slice(3),
				"aqua",
				"coral",
				"chartreuse",
				"tomato",
				"rebeccapurple",
				"color(",
				"lab(",
				"rgb(",
				"navy",
				"gold",
				"hue-rotate(20deg",
				"color-mix(in srgb,var(--signal),white)",
			]),
		);
		expect(violations.filter((violation) => violation === "rgb(")).toHaveLength(
			2,
		);
	});

	it("keeps orange opaque and control boundaries contrast-safe", () => {
		expect(stylesheet).not.toMatch(
			/color-mix\([^)]*var\(--(?:signal|ring)\)[^)]*transparent/,
		);
		const productionSources = listVisualSourceFiles(
			resolve(process.cwd(), "src"),
		).map((file) => readFileSync(file, "utf8"));
		expect(productionSources.join("\n")).not.toMatch(
			/\b(?:ring|outline)-(?:signal|ring)\/\d+\b/,
		);
		expect(darkTheme).toContain("--border: #3e3c37");
	});

	it("anchors grayscale editorial imagery with an exact orange rule", () => {
		expect(stylesheet).not.toMatch(/\n\s*img\s*\{/);
		expect(stylesheet).toMatch(
			/\.editorial-image\s*\{[\s\S]*filter:\s*grayscale\(1\)/,
		);
		expect(stylesheet).toMatch(
			/\.editorial-image-frame\s*\{[\s\S]*border-bottom:\s*0\.375rem solid var\(--signal\)/,
		);
		const editorialImageRule = stylesheet.match(
			/\.editorial-image\s*\{([^}]*)\}/,
		)?.[1];
		expect(editorialImageRule).not.toContain("border");
		for (const source of [appSource, ideaDetailSource, ideaDiscoverySource]) {
			const editorialImageCount = source.match(
				/className="editorial-image(?:\s[^"]*)?"/g,
			)?.length;
			const framedEditorialImageCount = source.match(
				/<div className="editorial-image-frame[^"]*">\s*<img[\s\S]*?className="editorial-image(?:\s[^"]*)?"[\s\S]*?\/>\s*<\/div>/g,
			)?.length;
			expect(editorialImageCount).toBeGreaterThan(0);
			expect(framedEditorialImageCount).toBe(editorialImageCount);
		}
		expect(profilePageSource).not.toContain("editorial-image");
		expect(profilePageSource).not.toContain("editorial-image-frame");
	});

	it("spaces the main bounty cards for easier catalog scanning", () => {
		expect(ideaDiscoverySource).toContain(
			'className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3"',
		);
		expect(ideaDiscoverySource).toContain(
			'className="group relative overflow-hidden border border-border bg-card',
		);
	});

	it("uses orange as decoration rather than low-contrast small text on white", () => {
		expect(stylesheet).toMatch(/\.signal-label\s*\{[\s\S]*text-foreground/);
		expect(appSource).toContain('className="text-signal"');
	});

	it("uses one restrained grid signature without contour decoration", () => {
		const productionSources = listVisualSourceFiles(
			resolve(process.cwd(), "src"),
		).map((file) => readFileSync(file, "utf8"));
		expect(stylesheet).toContain(".bounty-grid");
		expect(stylesheet).toContain("background-image:");
		expect(stylesheet).not.toContain(".field-grid");
		expect(stylesheet).not.toContain(".contour-field");
		expect(productionSources.join("\n")).not.toMatch(
			/\b(?:field-grid|contour-field)\b/,
		);
	});

	it("removes nonessential motion when the operating system requests it", () => {
		expect(stylesheet).toMatch(
			/@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*animation-duration:/,
		);
	});

	it("uses the signal token on fixed-black inverse surfaces", () => {
		expect(appSource).toContain("border-l-signal");
		expect(appSource).toContain("text-signal");
		expect(pilotPageSource).toContain("border-t-signal");
		expect(pilotPageSource).toContain("text-signal");
		expect(interestPanelSource).toContain("border-t-signal");
		expect(interestPanelSource).toContain("bg-black");
		expect(ideaDetailSource).toContain("bg-black");
		expect(ideaDetailSource).toContain("text-signal");
		expect(interestPanelSource).not.toMatch(
			/\b(?:text|border|bg)-background(?:\/\d+)?\b/,
		);
		expect(interestPanelSource).not.toContain("border-white/25");
		expect(appSource).not.toContain("text-white/40");
	});

	it("sets the saved or system theme before the application loads", () => {
		expect(appShell).toContain("ideascape.theme");
		expect(appShell).toContain("prefers-color-scheme: dark");
		expect(appShell).toContain('classList.add("dark")');
	});

	it("describes the landing page as authorized security bounties", () => {
		expect(appShell).toContain(
			"<title>IdeaScape — Authorized security bounties</title>",
		);
	});
});
