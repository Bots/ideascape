import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("home explains one authorized security-bounty workflow", async ({
	page,
}) => {
	await page.goto("/");
	await expect(
		page.getByRole("heading", { name: /test security with scope and proof/i }),
	).toBeVisible();
	await expect(
		page.getByRole("region", { name: /from bounty to verified result/i }),
	).toBeVisible();
	await expect(
		page.getByRole("region", {
			name: /scope is visible. authorization stays separate/i,
		}),
	).toBeVisible();
	expect(
		await page.evaluate(
			() =>
				document.documentElement.scrollWidth <=
				document.documentElement.clientWidth,
		),
	).toBe(true);
});

test("mobile home keeps controls out of the content flow", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	await expect(
		page.getByRole("heading", { name: /test security/i }),
	).toBeVisible();
	const themeToggle = page.getByRole("button", {
		name: /switch to (?:light|dark) mode/i,
	});
	await expect(themeToggle).toBeVisible();
	expect(
		await themeToggle.evaluate((element) => getComputedStyle(element).position),
	).not.toBe("fixed");
	expect(
		await page.evaluate(
			() =>
				document.documentElement.scrollWidth <=
				document.documentElement.clientWidth,
		),
	).toBe(true);
});

test("discovery is a scannable bounty catalog", async ({ page }) => {
	await page.goto("/ideas");
	await expect(
		page.getByRole("heading", { name: /authorized security bounties/i }),
	).toBeVisible();
	await expect(page.getByText("27 bounties", { exact: true })).toBeVisible();
	await expect(page.locator("main article")).toHaveCount(27);
	await expect(page.getByText("Attack scenario", { exact: true })).toHaveCount(
		0,
	);
});

test("bounty detail keeps authorization and proof together", async ({
	page,
}) => {
	await page.goto("/ideas/project-time-capsule");
	await expect(
		page.getByRole("heading", {
			name: "Time Capsule Disclosure Bounty",
			exact: true,
		}),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: /scope the test. verify the result/i }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Rules of engagement", exact: true }),
	).toBeVisible();
	await expect(page.getByText("Proof required", { exact: true })).toBeVisible();
});
