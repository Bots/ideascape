import {
	createContext,
	type PropsWithChildren,
	useContext,
	useLayoutEffect,
	useMemo,
	useState,
} from "react";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "ideascape.theme";

const ThemeContext = createContext<
	| {
			theme: Theme;
			toggleTheme: () => void;
	  }
	| undefined
>(undefined);

function readInitialTheme(): Theme {
	try {
		const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
		if (savedTheme === "light" || savedTheme === "dark") {
			return savedTheme;
		}
	} catch {
		// Continue with the operating-system preference when storage is blocked.
	}

	return window.matchMedia?.("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function persistTheme(theme: Theme): void {
	try {
		window.localStorage.setItem(THEME_STORAGE_KEY, theme);
	} catch {
		// Theme selection still works for this page when storage is blocked.
	}
}

export function ThemeProvider({ children }: PropsWithChildren) {
	const [theme, setTheme] = useState<Theme>(readInitialTheme);

	useLayoutEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		document.documentElement.style.colorScheme = theme;
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute("content", theme === "dark" ? "#050505" : "#f2efe6");
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			toggleTheme: () => {
				setTheme((currentTheme) => {
					const nextTheme = currentTheme === "dark" ? "light" : "dark";
					persistTheme(nextTheme);
					return nextTheme;
				});
			},
		}),
		[theme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}

	return context;
}
