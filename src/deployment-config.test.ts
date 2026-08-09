/// <reference types="node" />
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import vercelConfig from "../vercel.json";

const supabaseConfig = readFileSync("supabase/config.toml", "utf8");

describe("Supabase hosted authentication configuration", () => {
	it("uses the production callback and enables Google without committing its secret", () => {
		expect(supabaseConfig).toContain(
			'site_url = "https://ideascape-gamma.vercel.app"',
		);
		expect(supabaseConfig).toContain(
			'"https://ideascape-gamma.vercel.app/auth/callback"',
		);
		expect(supabaseConfig).toMatch(
		/\[auth\.external\.google\][\s\S]*?enabled = true[\s\S]*?client_id = "674905397433-t4gfnh2suns4qugakmv2pd1u1hk98adc\.apps\.googleusercontent\.com"[\s\S]*?secret = "env\(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET\)"/,
	);
});
});

describe("Vercel deployment routing", () => {
	it("serves the SPA entry point for client-side routes", () => {
		expect(vercelConfig).toMatchObject({
			$schema: "https://openapi.vercel.sh/vercel.json",
			rewrites: [{ source: "/(.*)", destination: "/index.html" }],
		});
	});
});
