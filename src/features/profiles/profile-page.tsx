import { useQuery } from "@tanstack/react-query";
import { Globe2, Lightbulb, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicProfile } from "@/features/profiles/profile-service";

function ProfileShell({ children }: { children: ReactNode }) {
	return (
		<main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6 py-12 text-foreground">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.84_0.12_155_/_0.3),transparent_34%),radial-gradient(circle_at_80%_10%,oklch(0.82_0.11_250_/_0.22),transparent_30%)]" />
			<section className="relative w-full max-w-2xl rounded-2xl border bg-background/90 p-8 shadow-sm backdrop-blur sm:p-10">
				<Link
					to="/"
					className="mb-10 flex items-center gap-3 font-semibold tracking-tight"
				>
					<span className="grid size-9 place-items-center rounded-xl bg-foreground text-background">
						<Lightbulb className="size-5" aria-hidden="true" />
					</span>
					<span className="text-lg">Ideascape</span>
				</Link>
				{children}
			</section>
		</main>
	);
}

function safeHttpUrl(value: string | null): string | null {
	if (!value) {
		return null;
	}

	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:"
			? url.href
			: null;
	} catch {
		return null;
	}
}

export function ProfilePage() {
	const { username } = useParams<{ username: string }>();
	const profileQuery = useQuery({
		queryKey: ["public-profile", username],
		queryFn: () => getPublicProfile(username ?? ""),
		enabled: Boolean(username),
		retry: false,
	});

	if (!username) {
		return (
			<ProfileShell>
				<h1 className="text-3xl font-semibold tracking-tight">
					Profile not found
				</h1>
				<p className="mt-3 text-muted-foreground">
					This profile address is incomplete.
				</p>
				<Link
					className="mt-6 inline-block font-medium underline underline-offset-4"
					to="/"
				>
					Return home
				</Link>
			</ProfileShell>
		);
	}

	if (profileQuery.isPending) {
		return (
			<ProfileShell>
				<div
					className="flex items-center gap-3 text-muted-foreground"
					role="status"
				>
					<LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
					Loading profile…
				</div>
			</ProfileShell>
		);
	}

	if (profileQuery.isError) {
		return (
			<ProfileShell>
				<h1 className="text-3xl font-semibold tracking-tight">
					Profile unavailable
				</h1>
				<p className="mt-3 text-muted-foreground" role="alert">
					Unable to load this profile. Please try again.
				</p>
				<Link
					className="mt-6 inline-block font-medium underline underline-offset-4"
					to="/"
				>
					Return home
				</Link>
			</ProfileShell>
		);
	}

	const profile = profileQuery.data;
	if (!profile) {
		return (
			<ProfileShell>
				<h1 className="text-3xl font-semibold tracking-tight">
					Profile not found
				</h1>
				<p className="mt-3 text-muted-foreground">
					We couldn&apos;t find an Ideascape member with that username.
				</p>
				<Link
					className="mt-6 inline-block font-medium underline underline-offset-4"
					to="/"
				>
					Return home
				</Link>
			</ProfileShell>
		);
	}

	const avatarUrl = safeHttpUrl(profile.avatar_url);
	const websiteUrl = safeHttpUrl(profile.website);
	const initial = profile.display_name.trim().charAt(0).toUpperCase() || "I";

	return (
		<ProfileShell>
			<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
				{avatarUrl ? (
					<img
						className="size-24 rounded-2xl border object-cover"
						src={avatarUrl}
						alt={`${profile.display_name} avatar`}
					/>
				) : (
					<div
						className="grid size-24 shrink-0 place-items-center rounded-2xl bg-muted text-3xl font-semibold"
						aria-hidden="true"
					>
						{initial}
					</div>
				)}

				<div className="min-w-0 flex-1">
					<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
						{profile.display_name}
					</h1>
					<p className="mt-1 break-all text-sm text-muted-foreground">
						@{profile.username}
					</p>
					{profile.bio ? (
						<p className="mt-5 whitespace-pre-wrap leading-7">{profile.bio}</p>
					) : (
						<p className="mt-5 text-muted-foreground">
							This member hasn&apos;t added a bio yet.
						</p>
					)}
					{websiteUrl ? (
						<a
							className="mt-6 inline-flex items-center gap-2 font-medium underline underline-offset-4"
							href={websiteUrl}
							target="_blank"
							rel="noreferrer"
						>
							<Globe2 className="size-4" aria-hidden="true" />
							Visit website
						</a>
					) : null}
				</div>
			</div>
		</ProfileShell>
	);
}
