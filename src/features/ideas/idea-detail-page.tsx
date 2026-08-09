import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lightbulb, LoaderCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import {
	getPublishedIdea,
	type IdeaMedia,
	type PublishedIdeaStatus,
} from "@/features/ideas/idea-discovery-service";

const statusLabels: Record<PublishedIdeaStatus, string> = {
	published: "Published",
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
				className={buttonVariants({ variant: "outline" })}
				href={media.url}
				rel="noreferrer"
				target="_blank"
			>
				Watch {accessibleName}
			</a>
		);
	}

	return (
		<img
			alt={accessibleName}
			className="w-full rounded-2xl border bg-muted object-cover"
			loading="lazy"
			src={media.url}
		/>
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
		<main className="relative min-h-screen overflow-hidden bg-background text-foreground">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.84_0.12_155_/_0.3),transparent_34%),radial-gradient(circle_at_80%_10%,oklch(0.82_0.11_250_/_0.22),transparent_30%)]" />
			<div className="relative mx-auto min-h-screen max-w-5xl px-6 py-8 lg:px-10">
				<header className="flex items-center justify-between gap-4">
					<Link
						className="flex items-center gap-3 font-semibold tracking-tight"
						to="/"
					>
						<span className="grid size-9 place-items-center rounded-xl bg-foreground text-background">
							<Lightbulb className="size-5" aria-hidden="true" />
						</span>
						<span className="text-lg">Ideascape</span>
					</Link>
					<Link
						className={buttonVariants({ variant: "outline" })}
						to="/ideas"
					>
						<ArrowLeft aria-hidden="true" />
						Back to ideas
					</Link>
				</header>

				{ideaQuery.isPending ? (
					<div
						className="flex min-h-[65vh] items-center justify-center gap-3 text-muted-foreground"
						role="status"
					>
						<LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
						Loading idea…
					</div>
				) : null}

				{ideaQuery.isError ? (
					<section className="mx-auto mt-24 max-w-xl rounded-2xl border bg-background/85 p-8 text-center shadow-sm backdrop-blur">
						<h1 className="text-3xl font-semibold tracking-tight">
							Something went wrong
						</h1>
						<p className="mt-4 text-destructive" role="alert">
							Unable to load this idea. Please try again.
						</p>
					</section>
				) : null}

				{ideaQuery.isSuccess && !ideaQuery.data ? (
					<section className="mx-auto mt-24 max-w-xl rounded-2xl border bg-background/85 p-8 text-center shadow-sm backdrop-blur">
						<h1 className="text-3xl font-semibold tracking-tight">
							Idea not found
						</h1>
						<p className="mt-4 leading-7 text-muted-foreground">
							This idea may be private, unpublished, or no longer available.
						</p>
						<Link className={buttonVariants({ className: "mt-6" })} to="/ideas">
							Browse ideas
						</Link>
					</section>
				) : null}

				{ideaQuery.data ? (
					<article className="py-16 sm:py-24">
						<div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
							{ideaQuery.data.category ? (
								<span>{ideaQuery.data.category.name}</span>
							) : null}
							{ideaQuery.data.category ? <span aria-hidden="true">·</span> : null}
							<span>{statusLabels[ideaQuery.data.status]}</span>
						</div>

						<h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
							{ideaQuery.data.title}
						</h1>
						<p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground">
							{ideaQuery.data.summary}
						</p>
						<p className="mt-8 text-sm text-muted-foreground">
							Created by{" "}
							<Link
								className="font-medium text-foreground underline underline-offset-4"
								to={`/profiles/${ideaQuery.data.creator.username}`}
							>
								{ideaQuery.data.creator.display_name}
							</Link>
						</p>

						{ideaQuery.data.media.length > 0 ? (
							<section className="mt-12 grid gap-6" aria-label="Idea media">
								{ideaQuery.data.media.map((media) => (
									<IdeaMediaItem key={media.id} media={media} />
								))}
							</section>
						) : null}

						<section className="mt-14 border-t pt-10" aria-labelledby="about-idea">
							<h2 className="text-2xl font-semibold tracking-tight" id="about-idea">
								About this idea
							</h2>
							<p className="mt-5 max-w-3xl whitespace-pre-wrap text-lg leading-8 text-muted-foreground">
								{ideaQuery.data.description}
							</p>
						</section>
					</article>
				) : null}
			</div>
		</main>
	);
}
