import { useQuery } from "@tanstack/react-query";
import {
	ArrowUpRight,
	BadgeCheck,
	LoaderCircle,
	ShieldCheck,
	Sparkles,
	TriangleAlert,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { InterestModeNotice } from "@/components/interest-mode-notice";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import {
	getPublishedIdea,
	type IdeaMedia,
	listPublishedIdeas,
	type PublishedIdeaStatus,
} from "@/features/ideas/idea-discovery-service";
import { IdeaInterestPanel } from "@/features/ideas/idea-interest-panel";
import { IdeaValidationEvidencePanel } from "@/features/ideas/idea-validation-evidence-panel";
import { IdeaValidationPanel } from "@/features/ideas/idea-validation-panel";

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
		<div className="overflow-hidden border border-foreground/20 bg-card p-2">
			<img
				alt={accessibleName}
				className="aspect-video w-full object-cover"
				loading="lazy"
				src={media.url}
			/>
		</div>
	);
}

function IdeaSecurityCase({
	threatScenario,
	controlBoundary,
	proofRequired,
}: {
	threatScenario: string;
	controlBoundary: string;
	proofRequired: string;
}) {
	const claims = [
		{
			label: "Threat scenario",
			value: threatScenario,
			icon: TriangleAlert,
		},
		{
			label: "Control boundary",
			value: controlBoundary,
			icon: ShieldCheck,
		},
		{
			label: "Proof required",
			value: proofRequired,
			icon: BadgeCheck,
		},
	];

	return (
		<section
			aria-labelledby="idea-security-case"
			className="mt-8 overflow-hidden border border-foreground/15 bg-foreground text-background"
		>
			<div className="border-b border-background/15 p-6 sm:flex sm:items-end sm:justify-between sm:gap-8 sm:p-8">
				<div>
					<p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[oklch(0.82_0.15_60)] dark:text-[oklch(0.5_0.18_48)]">
						<ShieldCheck className="size-4" aria-hidden="true" />
						Security case
					</p>
					<h2
						className="mt-3 text-3xl font-light tracking-[-0.025em] sm:text-4xl"
						id="idea-security-case"
					>
						Security case: what must be true before this expands
					</h2>
				</div>
				<p className="mt-4 max-w-md text-sm leading-6 text-background/70 sm:mt-0">
					A proposed control is not a guarantee. This preview names the failure
					path, the operating boundary, and the evidence needed to earn a larger
					test.
				</p>
			</div>
			<div className="grid gap-px bg-background/15 lg:grid-cols-3">
				{claims.map(({ label, value, icon: Icon }) => (
					<article className="bg-foreground p-6 sm:p-8" key={label}>
						<div className="flex items-center gap-3 text-[oklch(0.82_0.15_60)] dark:text-[oklch(0.5_0.18_48)]">
							<Icon className="size-5" aria-hidden="true" />
							<h3 className="text-xs font-bold uppercase tracking-[0.16em]">
								{label}
							</h3>
						</div>
						<p className="mt-4 text-sm leading-7 text-background/82">{value}</p>
					</article>
				))}
			</div>
		</section>
	);
}

export function IdeaDetailPage() {
	const { slug = "" } = useParams<{ slug: string }>();
	const ideaQuery = useQuery({
		queryKey: ["published-idea", slug],
		queryFn: () => (slug ? getPublishedIdea(slug) : Promise.resolve(null)),
		retry: false,
	});
	const relatedIdeasQuery = useQuery({
		queryKey: ["published-ideas"],
		queryFn: listPublishedIdeas,
		enabled: Boolean(ideaQuery.data?.category),
		retry: false,
	});
	const relatedIdeas = (relatedIdeasQuery.data ?? [])
		.filter(
			(idea) =>
				idea.id !== ideaQuery.data?.id &&
				idea.category?.slug === ideaQuery.data?.category?.slug,
		)
		.slice(0, 3);

	return (
		<>
			<SiteHeader exploreLabel="Back to ideas" />
			<main className="field-grid contour-field min-h-screen overflow-hidden text-foreground">
				<div className="site-shell min-h-screen">
					{ideaQuery.isPending ? (
						<div
							className="field-panel mt-12 flex min-h-[55vh] items-center justify-center gap-3 border-l-4 border-l-primary text-muted-foreground"
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
						<section className="field-panel mx-auto mt-24 max-w-xl border-t-4 border-t-destructive p-8 text-center">
							<h1 className="text-3xl font-semibold tracking-tight">
								Something went wrong
							</h1>
							<p className="mt-4 text-destructive" role="alert">
								Unable to load this idea. Please try again.
							</p>
						</section>
					) : null}

					{ideaQuery.isSuccess && !ideaQuery.data ? (
						<section className="field-panel mx-auto mt-24 max-w-xl border-t-4 border-t-primary p-8 text-center">
							<span className="mx-auto grid size-12 place-items-center border border-primary/30 text-primary">
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
						<article className="border-x border-b border-border bg-background/94 px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
							<div className="max-w-4xl">
								<div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
									{ideaQuery.data.category ? (
										<span className="border-l-2 border-primary pl-2 font-mono text-[0.6875rem] tracking-[0.12em] text-primary">
											{ideaQuery.data.category.name}
										</span>
									) : null}
									<span className="text-muted-foreground">
										{statusLabels[ideaQuery.data.status]}
									</span>
								</div>

								<h1 className="mt-6 text-balance text-5xl font-light leading-[1] tracking-[-0.035em] sm:text-7xl">
									{ideaQuery.data.title}
								</h1>
								<p className="mt-7 max-w-3xl text-xl leading-9 text-muted-foreground">
									{ideaQuery.data.summary}
								</p>
								<p className="mt-8 inline-flex items-center gap-2 border-l-2 border-signal pl-3 text-sm text-muted-foreground">
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
								className="field-panel relative mt-12 overflow-hidden border-t-4 border-t-primary p-8 sm:p-12"
								aria-labelledby="about-idea"
							>
								<div className="flex items-center gap-3">
									<span className="grid size-10 place-items-center border border-primary/30 text-primary">
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
							{ideaQuery.data.threat_scenario &&
							ideaQuery.data.control_boundary &&
							ideaQuery.data.proof_required ? (
								<IdeaSecurityCase
									controlBoundary={ideaQuery.data.control_boundary}
									proofRequired={ideaQuery.data.proof_required}
									threatScenario={ideaQuery.data.threat_scenario}
								/>
							) : null}
							<IdeaValidationPanel ideaId={ideaQuery.data.id} />
							<IdeaValidationEvidencePanel
								creatorId={ideaQuery.data.creator.id}
								ideaId={ideaQuery.data.id}
							/>
							{ideaQuery.data.slug === "project-time-capsule" ? (
								<section className="mt-8 border border-primary/25 border-l-4 border-l-primary bg-primary/7 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
									<div>
										<p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
											Evidence before commitment
										</p>
										<h2 className="mt-2 text-2xl font-semibold">
											See the precommitted pilot rules
										</h2>
										<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
											Review the evidence window, capacity, safety boundaries,
											and continue, revise, or archive thresholds before intake
											opens.
										</p>
									</div>
									<Link
										className={buttonVariants({ className: "mt-5 sm:mt-0" })}
										to="/pilots/project-time-capsule"
									>
										View pilot plan
										<ArrowUpRight aria-hidden="true" />
									</Link>
								</section>
							) : null}

							{ideaQuery.data.category && relatedIdeas.length > 0 ? (
								<section
									aria-labelledby="related-concepts-heading"
									className="mt-12"
								>
									<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
										<div>
											<p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
												Keep exploring
											</p>
											<h2
												className="mt-2 text-3xl font-semibold tracking-tight"
												id="related-concepts-heading"
											>
												More {ideaQuery.data.category.name} concepts
											</h2>
										</div>
										<Link
											className={buttonVariants({
												className: "h-10 px-4",
												variant: "outline",
											})}
											to={`/ideas?category=${encodeURIComponent(ideaQuery.data.category.slug)}`}
										>
											Browse all {ideaQuery.data.category.name} concepts
											<ArrowUpRight aria-hidden="true" />
										</Link>
									</div>

									<div className="mt-6 grid gap-px border border-border bg-border md:grid-cols-3">
										{relatedIdeas.map((relatedIdea) => {
											const cover = relatedIdea.media.find(
												(media) =>
													media.kind === "image" && isSafeMediaUrl(media.url),
											);

											return (
												<article
													className="group relative overflow-hidden bg-card transition-colors hover:bg-muted/45"
													key={relatedIdea.id}
												>
													<Link
														aria-label={`View ${relatedIdea.title}`}
														className="absolute inset-0 z-[1] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/70"
														to={`/ideas/${relatedIdea.slug}`}
													/>
													{cover ? (
														<img
															alt=""
															className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.035]"
															loading="lazy"
															src={cover.url}
														/>
													) : null}
													<div className="p-5">
														<h3 className="text-xl font-semibold tracking-tight">
															{relatedIdea.title}
														</h3>
														<p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
															{relatedIdea.summary}
														</p>
														<ArrowUpRight
															aria-hidden="true"
															className="mt-4 size-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
														/>
													</div>
												</article>
											);
										})}
									</div>
								</section>
							) : null}
							<IdeaInterestPanel ideaId={ideaQuery.data.id} />
						</article>
					) : null}
				</div>
			</main>
		</>
	);
}
