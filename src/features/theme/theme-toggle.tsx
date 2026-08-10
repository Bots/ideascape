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
			className="fixed bottom-5 right-5 z-50 size-11 rounded-sm border-primary/35 bg-card text-foreground hover:border-primary hover:bg-muted sm:bottom-7 sm:right-7"
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
