import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { signOut } from "@/features/auth/auth-service";
import { cn } from "@/lib/utils";

export function AuthNavigation() {
	const { user, isLoading } = useAuth();
	const [isSigningOut, setIsSigningOut] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	async function handleSignOut() {
		setIsSigningOut(true);
		setErrorMessage(null);

		try {
			await signOut();
		} catch {
			setErrorMessage("Unable to sign out. Please try again.");
		} finally {
			setIsSigningOut(false);
		}
	}

	if (isLoading) {
		return (
			<p className="text-sm text-muted-foreground" role="status">
				Restoring session…
			</p>
		);
	}

	if (!user) {
		return (
			<nav className="flex items-center gap-2" aria-label="Account">
				<Link
					className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
					to="/sign-in"
				>
					Sign in
				</Link>
				<Link className={cn(buttonVariants({ size: "sm" }))} to="/sign-up">
					Sign up
				</Link>
			</nav>
		);
	}

	return (
		<nav
			className="flex flex-wrap items-center justify-end gap-3"
			aria-label="Account"
		>
			<span className="max-w-48 truncate text-sm text-muted-foreground">
				{user.email ?? "Signed in"}
			</span>
			<Button
				variant="outline"
				size="sm"
				type="button"
				disabled={isSigningOut}
				onClick={() => void handleSignOut()}
			>
				{isSigningOut ? "Signing out…" : "Sign out"}
			</Button>
			{errorMessage ? (
				<p
					className="basis-full text-right text-xs text-destructive"
					role="alert"
				>
					{errorMessage}
				</p>
			) : null}
		</nav>
	);
}
