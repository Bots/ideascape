export const AUTH_RETURN_PATH_STORAGE_KEY = "ideascape.auth.returnTo";

export function safeReturnPath(value: string | null | undefined): string {
	if (!value?.startsWith("/") || value.startsWith("//")) {
		return "/";
	}

	if (value.includes("\\")) {
		return "/";
	}

	try {
		const baseUrl = new URL("https://ideascape.local");
		const candidate = new URL(value, baseUrl);
		if (candidate.origin !== baseUrl.origin) {
			return "/";
		}

		return `${candidate.pathname}${candidate.search}${candidate.hash}`;
	} catch {
		return "/";
	}
}

export function authPath(
	path: "/sign-in" | "/sign-up",
	returnTo: string,
): string {
	const safePath = safeReturnPath(returnTo);
	if (safePath === "/") {
		return path;
	}

	return `${path}?${new URLSearchParams({ returnTo: safePath }).toString()}`;
}

export function storeAuthReturnPath(returnTo: string): void {
	try {
		window.sessionStorage.setItem(
			AUTH_RETURN_PATH_STORAGE_KEY,
			safeReturnPath(returnTo),
		);
	} catch {
		// Storage can be unavailable in privacy-restricted browser contexts.
	}
}

export function readAuthReturnPath(): string {
	try {
		return safeReturnPath(
			window.sessionStorage.getItem(AUTH_RETURN_PATH_STORAGE_KEY),
		);
	} catch {
		return "/";
	}
}

export function clearAuthReturnPath(): void {
	try {
		window.sessionStorage.removeItem(AUTH_RETURN_PATH_STORAGE_KEY);
	} catch {
		// Storage can be unavailable in privacy-restricted browser contexts.
	}
}
