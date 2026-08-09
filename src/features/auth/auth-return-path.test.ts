import { beforeEach, describe, expect, it } from "vitest";
import {
	AUTH_RETURN_PATH_STORAGE_KEY,
	authPath,
	clearAuthReturnPath,
	readAuthReturnPath,
	safeReturnPath,
	storeAuthReturnPath,
} from "@/features/auth/auth-return-path";

beforeEach(() => {
	window.sessionStorage.clear();
});

describe("auth return paths", () => {
	it("preserves same-origin app paths, queries, and fragments", () => {
		expect(
			safeReturnPath("/ideas/clean-air-library?source=interest#signal"),
		).toBe("/ideas/clean-air-library?source=interest#signal");
	});

	it.each([
		null,
		"",
		"https://malicious.example/steal",
		"//malicious.example/steal",
		"/\\malicious.example/steal",
		"javascript:alert(1)",
	])("falls back home for unsafe destination %s", (destination) => {
		expect(safeReturnPath(destination)).toBe("/");
	});

	it("adds safe return paths to auth route links", () => {
		expect(authPath("/sign-in", "/ideas/clean-air-library")).toBe(
			"/sign-in?returnTo=%2Fideas%2Fclean-air-library",
		);
		expect(authPath("/sign-up", "/")).toBe("/sign-up");
	});

	it("stores, reads, and clears a validated OAuth return path", () => {
		storeAuthReturnPath("/ideas/clean-air-library");

		expect(window.sessionStorage.getItem(AUTH_RETURN_PATH_STORAGE_KEY)).toBe(
			"/ideas/clean-air-library",
		);
		expect(readAuthReturnPath()).toBe("/ideas/clean-air-library");

		clearAuthReturnPath();
		expect(readAuthReturnPath()).toBe("/");
	});

	it("validates stored values again before returning them", () => {
		window.sessionStorage.setItem(
			AUTH_RETURN_PATH_STORAGE_KEY,
			"https://malicious.example/steal",
		);

		expect(readAuthReturnPath()).toBe("/");
	});
});
