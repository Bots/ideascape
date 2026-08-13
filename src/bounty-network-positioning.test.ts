import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = join(import.meta.dirname, "..");
const read = (path: string) => readFileSync(join(repositoryRoot, path), "utf8");

const bountyMigration =
	"supabase/migrations/20260811193000_recast_as_authorized_bounty_network.sql";

const productModel = {
	primaryObject: "security bounty",
	owner: "system owner",
	reviewer: "reviewer",
	execution: "authorized test run",
} as const;

const majorSurfaces = [
	"src/App.tsx",
	"src/components/interest-mode-notice.tsx",
	"src/components/site-header.tsx",
	"src/features/auth/auth-page.tsx",
	"src/features/ideas/idea-discovery-page.tsx",
	"src/features/ideas/idea-detail-page.tsx",
	"src/features/ideas/idea-editor-page.tsx",
	"src/features/ideas/idea-interest-panel.tsx",
	"src/features/ideas/idea-validation-panel.tsx",
	"src/features/ideas/idea-validation-evidence-panel.tsx",
	"src/features/profiles/profile-page.tsx",
	"src/features/pilots/pilot-page.tsx",
	"src/features/admin/admin-page.tsx",
];

const bountyCatalog = [
	[
		"00000000-0000-4000-8000-000000000201",
		"clean-air-library",
		"Smoke Sensor Spoofing Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000202",
		"repair-commons",
		"Repair Station Privilege Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000203",
		"neighbor-ride-credits",
		"Trip Relay Metadata Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000204",
		"after-dark-storefronts",
		"Night Install Tamper Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000205",
		"shade-stop-network",
		"Transit Sensor Blind-Spot Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000206",
		"skill-swap-saturdays",
		"Repair Playbook Injection Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000207",
		"civic-accessibility-lab",
		"Crossing Signal Failure Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000208",
		"block-ready-kits",
		"Outage Kit Supply-Chain Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000209",
		"device-liberation-lab",
		"Device Unlock Boundary Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000210",
		"file-rescue-cooperative",
		"File Recovery Integrity Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000211",
		"cloud-exit-toolkit",
		"Cloud Exit Data-Loss Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000212",
		"private-ai-workbench",
		"Local AI Data-Leak Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000213",
		"home-lab-defense-clinic",
		"Home Lab Exposure Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000214",
		"community-compute-cooperative",
		"Shared Compute Escape Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000215",
		"offline-mesh-field-kit",
		"Mesh Relay Spoofing Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000216",
		"open-repair-atlas",
		"Repair Atlas Poisoning Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000217",
		"accessible-interface-retrofit-lab",
		"Accessible UI Regression Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000218",
		"project-time-capsule",
		"Time Capsule Disclosure Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000219",
		"waste-heat-works",
		"Heat Controller Fail-Safe Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000220",
		"model-commons-lab",
		"Model Eval Poisoning Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000221",
		"glass-box-sensor-network",
		"Plate Reader Privacy Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000222",
		"oral-history-provenance-lab",
		"Oral History Provenance Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000223",
		"neighborhood-incident-relay",
		"Incident Relay Impersonation Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000224",
		"phishing-drill-library",
		"Phishing Drill Containment Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000225",
		"water-sensor-integrity-watch",
		"Water Sensor Spoofing Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000226",
		"clinic-device-privacy-check",
		"Clinic Device Privacy Bounty",
	],
	[
		"00000000-0000-4000-8000-000000000227",
		"software-supply-chain-clinic",
		"Dependency Substitution Bounty",
	],
] as const;

describe("focused authorized security bounty platform", () => {
	it("uses one focused product model instead of competing hacker metaphors", () => {
		const visibleCopy = majorSurfaces.map(read).join("\n");
		for (const term of Object.values(productModel)) {
			expect(visibleCopy).toMatch(new RegExp(term, "i"));
		}
		for (const distractingMetaphor of [
			/channel open/i,
			/dead drop/i,
			/decrypt(?:ing)?/i,
			/swagger/i,
			/wreckage/i,
			/kill chain/i,
			/clean kill/i,
			/\bhunters?\b/i,
			/\bdossiers?\b/i,
			/\breceipts?\b/i,
			/\bproof-gates?\b/i,
			/\bbounty board\b/i,
			/\battack sectors?\b/i,
			/\btarget intel\b/i,
			/\b(?:clear|clean) trace\b/i,
			/\bbounty killed\b/i,
		]) {
			expect(visibleCopy).not.toMatch(distractingMetaphor);
		}
		expect(visibleCopy).not.toMatch(/\bSkull\b/);
		expect(read("src/components/interest-mode-notice.tsx")).not.toMatch(
			/\bCrosshair\b/,
		);
		expect(read("src/components/site-header.tsx")).toContain("IdeaScape");
		expect(read("src/components/site-header.tsx")).not.toContain(">Ideascape<");
	});

	it("uses the same security-bounty vocabulary on every major surface", () => {
		for (const path of majorSurfaces) {
			expect(read(path), `${path} lacks focused product language`).toMatch(
				/\b(?:security bount(?:y|ies)|system owner|reviewer|authorized test run|rules of engagement)\b/i,
			);
		}
	});

	it("makes authorization the non-negotiable rule without claiming platform payouts", () => {
		const visibleCopy = majorSurfaces.map(read).join("\n");
		expect(visibleCopy).toMatch(/no authorization, no test/i);
		expect(visibleCopy).toMatch(/written permission/i);
		expect(visibleCopy).toMatch(/does not handle payouts/i);
		expect(visibleCopy).not.toMatch(
			/\b(?:hack anything|no rules|unauthorized targets?|guaranteed payouts?|instant cash)\b/i,
		);
	});

	it("keeps the original private-interest meanings instead of turning them into hacker roles", () => {
		const interestPanel = read("src/features/ideas/idea-interest-panel.tsx");
		for (const label of [
			"I would use this",
			"I would help build it",
			"I could join an authorized test run",
			"I have relevant expertise",
			"Keep me updated",
		]) {
			expect(interestPanel).toContain(label);
		}
		expect(interestPanel).toMatch(/private interest/i);
		expect(interestPanel).toMatch(/grants no access/i);
		expect(interestPanel).toContain('value: "pilot"');
	});

	it("uses a black, bone, and signal-orange code-brutalist system", () => {
		const css = read("src/index.css");
		expect(css).toContain("--background: #050505");
		expect(css).toContain("--foreground: #f2efe6");
		expect(css).toContain("--signal: #ff5a1f");
		expect(css).toMatch(/\.packet-trace/);
		expect(css).toMatch(/\.bounty-grid/);
	});

	it("rewrites all 27 deterministic examples as distinct authorized bounties", () => {
		expect(existsSync(join(repositoryRoot, bountyMigration))).toBe(true);
		const migration = read(bountyMigration);
		for (const [id, slug, title] of bountyCatalog) {
			expect(migration).toContain(id);
			expect(migration).toContain(slug);
			expect(migration).toContain(title);
		}
		expect(migration.match(/ Bounty'/g)).toHaveLength(27);
		expect(migration).toMatch(
			/requires all 27 expected bounty UUID\/slug pairs/i,
		);
		expect(migration).toMatch(
			/authorized (?:sandbox|environment|assets?|systems?)/i,
		);
		expect(migration).toMatch(/rules of engagement/i);
		expect(migration).toMatch(/proof_required/i);
		expect(migration).not.toContain("ready-in-range");
		expect(migration).not.toContain(
			"Authorized security bounty illustration for ",
		);
		expect(migration).toContain(
			"Time Capsule Disclosure Bounty authorized test run",
		);
	});
});
