import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/features/theme/theme-provider";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";
	const actionLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

	return (
		<Button
			aria-label={actionLabel}
			className="fixed bottom-5 right-5 z-50 size-11 rounded-full border-primary/25 bg-card/90 text-foreground shadow-[0_14px_38px_-14px_oklch(0.25_0.05_43_/_0.7)] backdrop-blur-xl hover:bg-muted sm:bottom-7 sm:right-7"
			onClick={toggleTheme}
			size="icon-lg"
			title={actionLabel}
			type="button"
			variant="outline"
		>
			{isDark ? (
				<Sun className="size-5" aria-hidden="true" />
			) : (
				<Moon className="size-5" aria-hidden="true" />
			)}
		</Button>
	);
}
