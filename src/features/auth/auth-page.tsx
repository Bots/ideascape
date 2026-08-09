import { Lightbulb } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	signInWithEmail,
	signInWithOAuth,
	signUpWithEmail,
	type OAuthProvider,
} from "@/features/auth/auth-service";

export type AuthPageProps = {
	mode: "sign-in" | "sign-up";
};

export function AuthPage({ mode }: AuthPageProps) {
	const navigate = useNavigate();
	const [isPending, setIsPending] = useState(false);
	const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(
		null,
	);
	const [isSignUpComplete, setIsSignUpComplete] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const isSignIn = mode === "sign-in";

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsPending(true);
		setErrorMessage(null);

		const form = new FormData(event.currentTarget);
		const credentials = {
			email: String(form.get("email")),
			password: String(form.get("password")),
		};

		try {
			if (isSignIn) {
				await signInWithEmail(credentials);
				navigate("/");
			} else {
				const { hasSession } = await signUpWithEmail(credentials);
				if (hasSession) {
					navigate("/");
				} else {
					setIsSignUpComplete(true);
				}
			}
		} catch {
			setErrorMessage(
				isSignIn
					? "Unable to sign in. Please try again."
					: "Unable to create your account. Please try again.",
			);
		} finally {
			setIsPending(false);
		}
	}

	async function handleOAuth(provider: OAuthProvider) {
		setIsPending(true);
		setPendingProvider(provider);
		setErrorMessage(null);

		try {
			await signInWithOAuth(provider);
		} catch {
			const providerName = provider === "github" ? "GitHub" : "Google";
			setErrorMessage(
				`Unable to continue with ${providerName}. Please try again.`,
			);
		} finally {
			setIsPending(false);
			setPendingProvider(null);
		}
	}

	return (
		<main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6 py-12 text-foreground">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.84_0.12_155_/_0.3),transparent_34%),radial-gradient(circle_at_80%_10%,oklch(0.82_0.11_250_/_0.22),transparent_30%)]" />
			<section className="relative w-full max-w-md rounded-2xl border bg-background/90 p-8 shadow-sm backdrop-blur">
				<Link
					to="/"
					className="mb-8 flex items-center gap-3 font-semibold tracking-tight"
				>
					<span className="grid size-9 place-items-center rounded-xl bg-foreground text-background">
						<Lightbulb className="size-5" aria-hidden="true" />
					</span>
					<span className="text-lg">Ideascape</span>
				</Link>

				{isSignUpComplete ? (
					<div>
						<h1 className="text-3xl font-semibold tracking-tight">
							Check your email
						</h1>
						<p className="mt-3 text-sm leading-6 text-muted-foreground">
							We sent you a confirmation link. Follow it to finish creating your
							account.
						</p>
						<Link
							className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
							to="/sign-in"
						>
							Back to sign in
						</Link>
					</div>
				) : (
					<>
						<h1 className="text-3xl font-semibold tracking-tight">
							{isSignIn ? "Sign in" : "Create your account"}
						</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							{isSignIn
								? "Welcome back. Continue building ideas with your community."
								: "Join the community bringing ambitious ideas to life."}
						</p>

						<div className="mt-8 grid gap-3 sm:grid-cols-2">
							<Button
								variant="outline"
								type="button"
								disabled={isPending}
								onClick={() => void handleOAuth("github")}
							>
								{pendingProvider === "github"
									? "Connecting to GitHub…"
									: "Continue with GitHub"}
							</Button>
							<Button
								variant="outline"
								type="button"
								disabled={isPending}
								onClick={() => void handleOAuth("google")}
							>
								{pendingProvider === "google"
									? "Connecting to Google…"
									: "Continue with Google"}
							</Button>
						</div>

						<div className="my-6 flex items-center gap-3" aria-hidden="true">
							<span className="h-px flex-1 bg-border" />
							<span className="text-xs uppercase tracking-wider text-muted-foreground">
								or
							</span>
							<span className="h-px flex-1 bg-border" />
						</div>

						<form className="space-y-5" onSubmit={handleSubmit}>
							<div className="space-y-2">
								<label className="text-sm font-medium" htmlFor="email">
									Email
								</label>
								<input
									className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium" htmlFor="password">
									Password
								</label>
								<input
									className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
									id="password"
									name="password"
									type="password"
									autoComplete={isSignIn ? "current-password" : "new-password"}
									required
								/>
							</div>

							{errorMessage ? (
								<p className="text-sm text-destructive" role="alert">
									{errorMessage}
								</p>
							) : null}

							<Button className="w-full" type="submit" disabled={isPending}>
								{isPending
									? isSignIn
										? "Signing in…"
										: "Creating account…"
									: isSignIn
										? "Sign in"
										: "Create account"}
							</Button>
						</form>

						<p className="mt-6 text-center text-sm text-muted-foreground">
							{isSignIn ? "New to Ideascape? " : "Already have an account? "}
							<Link
								className="font-medium text-foreground underline underline-offset-4"
								to={isSignIn ? "/sign-up" : "/sign-in"}
							>
								{isSignIn ? "Sign up" : "Sign in"}
							</Link>
						</p>
					</>
				)}
			</section>
		</main>
	);
}
