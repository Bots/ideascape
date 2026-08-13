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
const backdropClassName = "hidden";
const cardClassName =
	"field-panel relative w-full max-w-md border-t-4 border-t-primary p-8 text-center";

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
						Your authentication provider is returning you to IdeaScape. Your
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
						className="mx-auto size-8 text-signal"
						aria-hidden="true"
					/>
					<h1 className="mt-6 text-3xl font-semibold tracking-tight">
						Signed in successfully
					</h1>
					<p className="mt-3 text-sm leading-6 text-muted-foreground">
						Your IdeaScape session is ready.
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
