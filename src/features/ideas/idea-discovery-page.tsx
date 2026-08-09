import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Lightbulb, LoaderCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import {
	listPublishedIdeas,
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

export function IdeaDiscoveryPage() {
	const ideasQuery = useQuery({
		queryKey: ["published-ideas"],
		queryFn: listPublishedIdeas,
		retry: false,
	});

	return (
		<main className="relative min-h-screen overflow-hidden bg-background text-foreground">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.84_0.12_155_/_0.3),transparent_34%),radial-gradient(circle_at_80%_10%,oklch(0.82_0.11_250_/_0.22),transparent_30%)]" />
			<div className="relative mx-auto min-h-screen max-w-6xl px-6 py-8 lg:px-10">
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
						to="/ideas/new"
					>
						Start an idea
					</Link>
				</header>

				<section className="py-20 sm:py-28">
					<p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
						Community possibilities
					</p>
					<h1 className="text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
						Discover ideas
					</h1>
					<p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
						Meet creators testing ambitious solutions and follow their progress
						from first proposal to real-world impact.
					</p>

					{ideasQuery.isPending ? (
						<div
							className="mt-16 flex items-center gap-3 text-muted-foreground"
							role="status"
						>
							<LoaderCircle
								className="size-5 animate-spin"
								aria-hidden="true"
							/>
							Loading ideas…
						</div>
					) : null}

					{ideasQuery.isError ? (
						<div className="mt-16 rounded-2xl border bg-background/80 p-8">
							<p className="text-destructive" role="alert">
								Unable to load ideas. Please try again.
							</p>
						</div>
					) : null}

					{ideasQuery.data?.length === 0 ? (
						<div className="mt-16 rounded-2xl border bg-background/80 p-8 sm:p-12">
							<Sparkles className="size-6" aria-hidden="true" />
							<h2 className="mt-5 text-3xl font-semibold tracking-tight">
								The first ideas are taking shape
							</h2>
							<p className="mt-3 max-w-xl leading-7 text-muted-foreground">
								Be the first creator to share a proposal with the Ideascape
								community.
							</p>
							<Link
								className={buttonVariants({ className: "mt-6" })}
								to="/ideas/new"
							>
								Start an idea
								<ArrowRight aria-hidden="true" />
							</Link>
						</div>
					) : null}

					{ideasQuery.data && ideasQuery.data.length > 0 ? (
						<div className="mt-16 grid gap-6 md:grid-cols-2">
							{ideasQuery.data.map((idea) => (
								<article
									className="flex flex-col rounded-2xl border bg-background/80 p-7 shadow-sm backdrop-blur"
									key={idea.id}
								>
									<div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
										{idea.category ? <span>{idea.category.name}</span> : null}
										{idea.category ? <span aria-hidden="true">·</span> : null}
										<span>{statusLabels[idea.status]}</span>
									</div>
									<h2 className="mt-5 text-2xl font-semibold tracking-tight">
										<Link
											className="hover:underline"
											to={`/ideas/${idea.slug}`}
										>
											{idea.title}
										</Link>
									</h2>
									<p className="mt-3 flex-1 leading-7 text-muted-foreground">
										{idea.summary}
									</p>
									<p className="mt-7 text-sm text-muted-foreground">
										By{" "}
										<Link
											className="font-medium text-foreground underline underline-offset-4"
											to={`/profiles/${idea.creator.username}`}
										>
											{idea.creator.display_name}
										</Link>
									</p>
								</article>
							))}
						</div>
					) : null}
				</section>
			</div>
		</main>
	);
}
