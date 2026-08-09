import { describe, expect, it } from "vitest";
import vercelConfig from "../vercel.json";

describe("Vercel deployment routing", () => {
	it("serves the SPA entry point for client-side routes", () => {
		expect(vercelConfig).toMatchObject({
			$schema: "https://openapi.vercel.sh/vercel.json",
			rewrites: [{ source: "/(.*)", destination: "/index.html" }],
		});
	});
});
