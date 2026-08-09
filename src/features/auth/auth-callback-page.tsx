import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-provider";
import {
	authPath,
	clearAuthReturnPath,
	readAuthReturnPath,
} from "@/features/auth/auth-return-path";

const pageClassName =
	"relative grid min-h-screen place-items-center overflow-hidden bg-background px-6 py-12 text-foreground";
const backdropClassName =
	"pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.84_0.12_155_/_0.3),transparent_34%),radial-gradient(circle_at_80%_10%,oklch(0.82_0.11_250_/_0.22),transparent_30%)]";
const cardClassName =
	"relative w-full max-w-md rounded-2xl border bg-background/90 p-8 text-center shadow-sm backdrop-blur";

export function AuthCallbackPage() {
	const { user, isLoading } = useAuth();
	const { search, hash } = useLocation();
	const returnTo = readAuthReturnPath();
	const hasReturnDestination = returnTo !== "/";
	const hasProviderError =
		new URLSearchParams(search).has("error") ||
		new URLSearchParams(hash.slice(1)).has("error");

	if (isLoading) {
		return (
			<main className={pageClassName}>
				<div className={backdropClassName} />
				<section className={cardClassName}>
					<LoaderCircle
						className="mx-auto size-8 animate-spin text-muted-foreground"
						aria-hidden="true"
					/>
					<h1 className="mt-6 text-3xl font-semibold tracking-tight">
						Completing your sign-in
					</h1>
					<p
						className="mt-3 text-sm leading-6 text-muted-foreground"
						role="status"
					>
						Your authentication provider is returning you to Ideascape. Your
						session will be restored automatically.
					</p>
					<Link
						className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
						to="/"
					>
						Return home
					</Link>
				</section>
			</main>
		);
	}

	if (user && !hasProviderError) {
		return (
			<main className={pageClassName}>
				<div className={backdropClassName} />
				<section className={cardClassName}>
					<CheckCircle2
						className="mx-auto size-8 text-emerald-600"
						aria-hidden="true"
					/>
					<h1 className="mt-6 text-3xl font-semibold tracking-tight">
						Signed in successfully
					</h1>
					<p className="mt-3 text-sm leading-6 text-muted-foreground">
						Your Ideascape session is ready.
					</p>
					<Link
						className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
						to={returnTo}
						onClick={clearAuthReturnPath}
					>
						{hasReturnDestination
							? "Continue where you left off"
							: "Continue home"}
					</Link>
				</section>
			</main>
		);
	}

	return (
		<main className={pageClassName}>
			<div className={backdropClassName} />
			<section className={cardClassName}>
				<XCircle
					className="mx-auto size-8 text-destructive"
					aria-hidden="true"
				/>
				<h1 className="mt-6 text-3xl font-semibold tracking-tight">
					Sign-in unsuccessful
				</h1>
				<p
					className="mt-3 text-sm leading-6 text-muted-foreground"
					role="alert"
				>
					We couldn&apos;t complete your sign-in. Please try again.
				</p>
				<div className="mt-6 flex justify-center gap-4">
					<Link
						className="text-sm font-medium underline underline-offset-4"
						to={authPath("/sign-in", returnTo)}
					>
						Sign in
					</Link>
					<Link
						className="text-sm font-medium underline underline-offset-4"
						to="/"
					>
						Return home
					</Link>
				</div>
			</section>
		</main>
	);
}
