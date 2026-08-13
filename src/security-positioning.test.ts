import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = join(import.meta.dirname, "..");
const sourceRoot = join(repositoryRoot, "src");

function productionTsxFiles(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) {
			return productionTsxFiles(path);
		}
		if (!entry.name.endsWith(".tsx") || entry.name.endsWith(".test.tsx")) {
			return [];
		}
		return [path];
	});
}

const visibleSourceFiles = [
	...productionTsxFiles(sourceRoot),
	join(repositoryRoot, "index.html"),
];
const positioningDocs = [
	join(repositoryRoot, "README.md"),
	join(repositoryRoot, "PLAN.md"),
	join(repositoryRoot, "docs/PROJECT_STATUS.md"),
];
const positioningMigrationPath = join(
	repositoryRoot,
	"supabase/migrations/20260811174500_reframe_as_security_validation_lab.sql",
);

const prohibitedPositioning = [
	{ label: "community framing", pattern: /\bcommunit(?:y|ies)\b/i },
	{ label: "neighbor framing", pattern: /\bneighbors?\b/i },
	{ label: "public-workshop framing", pattern: /\bpublic workshop\b/i },
	{ label: "learning-together framing", pattern: /\blearning together\b/i },
	{ label: "campaign framing", pattern: /\bcampaign funds?\b/i },
	{ label: "escrow roadmap", pattern: /\bmilestone-escrow\b/i },
	{ label: "blockchain roadmap", pattern: /\b(?:testnet|smart contracts?)\b/i },
	{ label: "generic concept activity", pattern: /\bconcept activity\b/i },
	{ label: "generic concept team", pattern: /\bconcept team\b/i },
	{ label: "generic concept creator", pattern: /\bconcept creator\b/i },
	{ label: "member identity framing", pattern: /\bmember identities\b/i },
	{
		label: "generic creator summary",
		pattern: /\bcreator response summary\b/i,
	},
	{ label: "generic pilot question", pattern: /\bpilot readiness question\b/i },
];
const prohibitedSourcePositioning = [
	{ label: "generic concept framing", pattern: /\bconcept\b/i },
	{ label: "generic member framing", pattern: /\bmember\b/i },
];

const securityAnchors = [
	"src/App.tsx",
	"src/components/interest-mode-notice.tsx",
	"src/components/site-header.tsx",
	"src/features/auth/auth-page.tsx",
	"src/features/ideas/idea-discovery-page.tsx",
	"src/features/ideas/idea-detail-page.tsx",
	"src/features/ideas/idea-editor-page.tsx",
	"src/features/ideas/idea-interest-panel.tsx",
	"src/features/profiles/profile-page.tsx",
	"src/features/pilots/pilot-page.tsx",
	"src/features/admin/admin-page.tsx",
];

describe("security-first product positioning", () => {
	it("removes community-first language from every user-facing route and product document", () => {
		const violations = [...visibleSourceFiles, ...positioningDocs].flatMap(
			(path) => {
				// The resilience domain retains its original database slug so existing
				// links remain valid; it is an internal compatibility identifier only.
				const content = readFileSync(path, "utf8")
					.replace(/https?:\/\/[^\s)]+/g, "")
					.replaceAll("/ideas?category=community", "");
				return prohibitedPositioning
					.filter(({ pattern }) => pattern.test(content))
					.map(({ label }) => `${relative(repositoryRoot, path)}: ${label}`);
			},
		);

		expect(violations).toEqual([]);
	});

	it("anchors every major route in security validation language", () => {
		for (const path of securityAnchors) {
			const content = readFileSync(join(repositoryRoot, path), "utf8");
			expect(content, `${path} lacks security-validation language`).toMatch(
				/\b(?:security|threat|control|risk|adversarial|authorized|evidence)\b/i,
			);
		}
	});

	it("keeps private review intent labels aligned with persisted meanings", () => {
		const interestPanel = readFileSync(
			join(repositoryRoot, "src/features/ideas/idea-interest-panel.tsx"),
			"utf8",
		);
		for (const meaning of [
			"I would use this",
			"I would help build it",
			"I could join an authorized test run",
			"I have relevant expertise",
			"Keep me updated",
		]) {
			expect(interestPanel).toMatch(new RegExp(`\\b${meaning}\\b`, "i"));
		}
		expect(interestPanel).toContain('value: "pilot"');
		expect(interestPanel).not.toMatch(
			/\b(?:system operators?|control testers?|exercise hosts?|threat-model reviewers?)\b/i,
		);
	});

	it("removes generic concept and member framing from production routes", () => {
		const violations = visibleSourceFiles.flatMap((path) => {
			const content = readFileSync(path, "utf8");
			return prohibitedSourcePositioning
				.filter(({ pattern }) => pattern.test(content))
				.map(({ label }) => `${relative(repositoryRoot, path)}: ${label}`);
		});

		expect(violations).toEqual([]);
	});

	it("limits catalog rewrites to the exact deterministic manifest and avoids timestamp churn", () => {
		const migration = readFileSync(positioningMigrationPath, "utf8");
		const ideaUpdates = migration.split(/update public\.ideas/gi).slice(1);
		const exactSeedSlugs = [
			"clean-air-library",
			"repair-commons",
			"neighbor-ride-credits",
			"after-dark-storefronts",
			"shade-stop-network",
			"skill-swap-saturdays",
			"civic-accessibility-lab",
			"block-ready-kits",
			"device-liberation-lab",
			"file-rescue-cooperative",
			"cloud-exit-toolkit",
			"private-ai-workbench",
			"home-lab-defense-clinic",
			"community-compute-cooperative",
			"offline-mesh-field-kit",
			"open-repair-atlas",
			"accessible-interface-retrofit-lab",
			"project-time-capsule",
			"waste-heat-works",
			"model-commons-lab",
			"glass-box-sensor-network",
			"oral-history-provenance-lab",
			"neighborhood-incident-relay",
			"phishing-drill-library",
			"water-sensor-integrity-watch",
			"clinic-device-privacy-check",
			"software-supply-chain-clinic",
		];

		expect(ideaUpdates.length).toBeGreaterThan(0);
		for (const update of ideaUpdates) {
			expect(update.split(";")[0]).toContain(
				"ideascape_positioning_seed_manifest",
			);
		}
		for (const [offset, slug] of exactSeedSlugs.entries()) {
			const suffix = String(201 + offset).padStart(12, "0");
			expect(migration).toContain(
				`('00000000-0000-4000-8000-${suffix}', '${slug}')`,
			);
		}
		expect(migration).toMatch(
			/update public\.idea_media[\s\S]+ideascape_positioning_seed_manifest/i,
		);
		expect(migration).toMatch(
			/update public\.idea_validation_options[\s\S]+ideascape_positioning_seed_manifest/i,
		);
		expect(migration).toMatch(
			/requires all 27 expected deterministic UUID\/slug pairs/i,
		);
		expect(migration).toMatch(/is distinct from/i);
	});
});
