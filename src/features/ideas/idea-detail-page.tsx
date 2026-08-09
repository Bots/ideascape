import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	ArrowUpRight,
	Lightbulb,
	LoaderCircle,
	Sparkles,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { InterestModeNotice } from "@/components/interest-mode-notice";
import { buttonVariants } from "@/components/ui/button";
import {
	getPublishedIdea,
	type IdeaMedia,
	type PublishedIdeaStatus,
} from "@/features/ideas/idea-discovery-service";

const statusLabels: Record<PublishedIdeaStatus, string> = {
	published: "Concept preview",
	funding: "Funding",
	funded: "Funded",
	in_progress: "In progress",
	completed: "Completed",
	cancelled: "Cancelled",
};

function isSafeMediaUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === "https:" || url.protocol === "http:";
	} catch {
		return false;
	}
}

function IdeaMediaItem({ media }: { media: IdeaMedia }) {
	if (!isSafeMediaUrl(media.url)) {
		return null;
	}

	const accessibleName = media.alt_text || "Idea media";

	if (media.kind === "video") {
		return (
			<a
				className={buttonVariants({
					variant: "outline",
					className: "h-11 bg-card px-5 shadow-sm",
				})}
				href={media.url}
				rel="noreferrer"
				target="_blank"
			>
				Watch {accessibleName}
				<ArrowUpRight aria-hidden="true" />
			</a>
		);
	}

	return (
		<div className="overflow-hidden rounded-[2rem] border-2 border-card bg-card p-2 shadow-[0_30px_75px_-30px_oklch(0.3_0.08_43_/_0.55)]">
			<img
				alt={accessibleName}
				className="aspect-video w-full rounded-[1.55rem] object-cover"
				loading="lazy"
				src={media.url}
			/>
		</div>
	);
}

export function IdeaDetailPage() {
	const { slug = "" } = useParams<{ slug: string }>();
	const ideaQuery = useQuery({
		queryKey: ["published-idea", slug],
		queryFn: () => (slug ? getPublishedIdea(slug) : Promise.resolve(null)),
		retry: false,
	});

	return (
		<main className="relative min-h-screen overflow-hidden text-foreground">
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.76_0.08_65_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.76_0.08_65_/_0.1)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:linear-gradient(to_bottom,black,transparent_68%)]" />
			<div className="pointer-events-none absolute -right-40 top-28 size-[32rem] rounded-full bg-primary/12 blur-3xl" />

			<div className="relative mx-auto min-h-screen max-w-6xl px-5 py-5 sm:px-8 lg:px-12">
				<header className="flex items-center justify-between gap-4 rounded-2xl border bg-card/80 px-4 py-3 shadow-[0_18px_60px_-35px_oklch(0.36_0.09_43_/_0.45)] backdrop-blur-xl sm:px-5">
					<Link
						className="flex items-center gap-3 font-semibold tracking-tight"
						to="/"
					>
						<span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_24px_-10px_oklch(0.57_0.2_39)]">
							<Lightbulb className="size-5" aria-hidden="true" />
						</span>
						<span className="text-lg">Ideascape</span>
					</Link>
					<Link
						className={buttonVariants({
							variant: "outline",
							className: "h-10 bg-card/80 px-4",
						})}
						to="/ideas"
					>
						<ArrowLeft aria-hidden="true" />
						Back to ideas
					</Link>
				</header>

				{ideaQuery.isPending ? (
					<div
						className="mt-12 flex min-h-[55vh] items-center justify-center gap-3 rounded-3xl border bg-card/70 text-muted-foreground shadow-sm"
						role="status"
					>
						<LoaderCircle
							className="size-5 animate-spin text-primary"
							aria-hidden="true"
						/>
						Loading idea…
					</div>
				) : null}

				{ideaQuery.isError ? (
					<section className="mx-auto mt-24 max-w-xl rounded-3xl border bg-card/90 p-8 text-center shadow-xl">
						<h1 className="text-3xl font-semibold tracking-tight">
							Something went wrong
						</h1>
						<p className="mt-4 text-destructive" role="alert">
							Unable to load this idea. Please try again.
						</p>
					</section>
				) : null}

				{ideaQuery.isSuccess && !ideaQuery.data ? (
					<section className="mx-auto mt-24 max-w-xl rounded-3xl border bg-card/90 p-8 text-center shadow-xl">
						<span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
							<Sparkles className="size-6" aria-hidden="true" />
						</span>
						<h1 className="mt-5 text-3xl font-semibold tracking-tight">
							Idea not found
						</h1>
						<p className="mt-4 leading-7 text-muted-foreground">
							This idea may be private, unpublished, or no longer available.
						</p>
						<Link
							className={buttonVariants({ className: "mt-6 h-10 px-4" })}
							to="/ideas"
						>
							Browse ideas
						</Link>
					</section>
				) : null}

				{ideaQuery.data ? (
					<article className="py-14 sm:py-20">
						<div className="max-w-4xl">
							<div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
								{ideaQuery.data.category ? (
									<span className="rounded-full bg-primary/10 px-3 py-1.5 text-primary">
										{ideaQuery.data.category.name}
									</span>
								) : null}
								<span className="text-muted-foreground">
									{statusLabels[ideaQuery.data.status]}
								</span>
							</div>

							<h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
								{ideaQuery.data.title}
							</h1>
							<p className="mt-7 max-w-3xl text-xl leading-9 text-muted-foreground">
								{ideaQuery.data.summary}
							</p>
							<p className="mt-8 inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-sm text-muted-foreground shadow-sm">
								Created by{" "}
								<Link
									className="font-semibold text-foreground underline decoration-primary/45 underline-offset-4"
									to={`/profiles/${ideaQuery.data.creator.username}`}
								>
									{ideaQuery.data.creator.display_name}
								</Link>
							</p>
						</div>
						<InterestModeNotice className="mt-10" />

						{ideaQuery.data.media.length > 0 ? (
							<section className="mt-12 grid gap-6" aria-label="Idea media">
								{ideaQuery.data.media.map((media) => (
									<IdeaMediaItem key={media.id} media={media} />
								))}
							</section>
						) : null}

						<section
							className="relative mt-12 overflow-hidden rounded-3xl border bg-card/90 p-8 shadow-[0_24px_65px_-40px_oklch(0.33_0.09_43_/_0.55)] sm:p-12"
							aria-labelledby="about-idea"
						>
							<div className="absolute inset-y-0 left-0 w-1.5 bg-primary" />
							<div className="flex items-center gap-3">
								<span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
									<Sparkles className="size-5" aria-hidden="true" />
								</span>
								<h2
									className="text-2xl font-semibold tracking-tight"
									id="about-idea"
								>
									About this idea
								</h2>
							</div>
							<p className="mt-7 max-w-3xl whitespace-pre-wrap text-lg leading-8 text-muted-foreground">
								{ideaQuery.data.description}
							</p>
						</section>
					</article>
				) : null}
			</div>
		</main>
	);
}
