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
			className="fixed bottom-7 right-7 z-50 size-11 rounded-sm border-primary/35 bg-card text-foreground hover:border-primary hover:bg-muted max-sm:static max-sm:mx-auto max-sm:my-5 max-sm:size-10"
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
