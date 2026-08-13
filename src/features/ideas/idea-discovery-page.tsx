import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	ArrowRight,
	ArrowUpRight,
	LoaderCircle,
	Search,
	Sparkles,
	UsersRound,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { InterestModeNotice } from "@/components/interest-mode-notice";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import {
	listPublishedIdeas,
	type PublishedIdeaStatus,
} from "@/features/ideas/idea-discovery-service";

const statusLabels: Record<PublishedIdeaStatus, string> = {
	published: "Bounty open",
	funding: "Rules under review",
	funded: "Test run approved",
	in_progress: "Authorized test active",
	completed: "Results published",
	cancelled: "Bounty closed",
};

function isSafeImageUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === "https:" || url.protocol === "http:";
	} catch {
		return false;
	}
}

function interestLabel(count: number): string {
	if (count === 0) {
		return "Be first to leave a readiness signal";
	}

	if (count === 1) {
		return "1 readiness signal";
	}

	return `${count} readiness signals`;
}

function bountyCountLabel(count: number): string {
	return `${count} ${count === 1 ? "bounty" : "bounties"}`;
}

export function IdeaDiscoveryPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const ideasQuery = useQuery({
		queryKey: ["published-ideas"],
		queryFn: listPublishedIdeas,
		retry: false,
	});
	const categories = useMemo(() => {
		const uniqueCategories = new Map<string, string>();
		for (const idea of ideasQuery.data ?? []) {
			if (idea.category) {
				uniqueCategories.set(idea.category.slug, idea.category.name);
			}
		}

		return [...uniqueCategories.entries()]
			.map(([slug, name]) => ({ slug, name }))
			.sort((left, right) => left.name.localeCompare(right.name));
	}, [ideasQuery.data]);
	const requestedCategory = searchParams.get("category") ?? "all";
	const searchTerm = searchParams.get("q") ?? "";
	const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase();
	const selectedCategory =
		requestedCategory === "all" ||
		categories.some((category) => category.slug === requestedCategory)
			? requestedCategory
			: "all";
	const visibleIdeas = useMemo(
		() =>
			(ideasQuery.data ?? []).filter(
				(idea) =>
					(selectedCategory === "all" ||
						idea.category?.slug === selectedCategory) &&
					(normalizedSearchTerm.length === 0 ||
						[
							idea.title,
							idea.summary,
							idea.category?.name,
							idea.creator.display_name,
						]
							.filter(Boolean)
							.join(" ")
							.toLocaleLowerCase()
							.includes(normalizedSearchTerm)),
			),
		[ideasQuery.data, normalizedSearchTerm, selectedCategory],
	);

	function updateCategory(category: string) {
		const nextParams = new URLSearchParams(searchParams);
		if (category === "all") {
			nextParams.delete("category");
		} else {
			nextParams.set("category", category);
		}
		setSearchParams(nextParams, { replace: true });
	}

	function updateSearch(search: string) {
		const nextParams = new URLSearchParams(searchParams);
		if (search.length === 0) {
			nextParams.delete("q");
		} else {
			nextParams.set("q", search);
		}
		setSearchParams(nextParams, { replace: true });
	}

	function clearFilters() {
		setSearchParams(new URLSearchParams(), { replace: true });
	}

	return (
		<>
			<SiteHeader showExplore={false} />
			<main className="min-h-screen overflow-hidden text-foreground">
				<div className="site-shell min-h-screen">
					<section className="border-x border-b border-border bg-background/94 px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
						<div className="grid items-end gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_auto]">
							<div>
								<p className="signal-label mb-5 border-l-2 border-signal pl-3">
									Security bounties · public listings
								</p>
								<h1 className="text-5xl font-light tracking-[-0.035em] sm:text-7xl">
									Authorized{" "}
									<span className="text-signal">security bounties</span>
								</h1>
								<p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
									Every bounty names the attack scenario, rules of engagement,
									and proof required before an authorized test can begin.
								</p>
							</div>
							<div className="field-panel hidden min-w-52 border-t-4 border-t-primary px-6 py-5 lg:block">
								<p className="field-label">
									{ideasQuery.isError && ideasQuery.data === undefined
										? "Catalog status"
										: "Listing status"}
								</p>
								<p className="mt-2 text-3xl font-semibold tracking-tight">
									{ideasQuery.isError && ideasQuery.data === undefined
										? "Listings unavailable"
										: ideasQuery.data
											? bountyCountLabel(ideasQuery.data.length)
											: "Loading security bounties"}
								</p>
							</div>
						</div>
						<InterestModeNotice className="mt-8" />

						{ideasQuery.data && ideasQuery.data.length > 0 ? (
							<fieldset className="field-panel mt-8 grid gap-4 border-l-4 border-l-primary p-5 pr-16 lg:grid-cols-[1fr_17rem_auto] lg:items-end lg:pr-5">
								<legend className="sr-only">Filter authorized bounties</legend>
								<label
									className="grid gap-2 text-sm font-semibold"
									htmlFor="brief-search"
								>
									Search security bounties
									<span className="relative block">
										<Search
											aria-hidden="true"
											className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
										/>
										<input
											className="h-11 w-full rounded-sm border bg-background pl-10 pr-3 text-base font-normal text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
											id="brief-search"
											onChange={(event) => updateSearch(event.target.value)}
											placeholder="Try spoofing, privacy, or supply chain"
											type="search"
											value={searchTerm}
										/>
									</span>
								</label>
								<label
									className="grid gap-2 text-sm font-semibold"
									htmlFor="category-filter"
								>
									Security area
									<select
										className="h-11 w-full rounded-sm border bg-background px-3 text-base font-normal text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
										id="category-filter"
										onChange={(event) => updateCategory(event.target.value)}
										value={selectedCategory}
									>
										<option value="all">All security areas</option>
										{categories.map((category) => (
											<option key={category.slug} value={category.slug}>
												{category.name}
											</option>
										))}
									</select>
								</label>
								<p
									className="pb-3 text-sm font-medium text-muted-foreground"
									role="status"
								>
									Showing {visibleIdeas.length} of {ideasQuery.data.length}{" "}
									bounties
								</p>
							</fieldset>
						) : null}

						{ideasQuery.isPending ? (
							<div
								className="field-panel mt-16 flex items-center gap-3 border-l-4 border-l-primary p-7 text-muted-foreground"
								role="status"
							>
								<LoaderCircle
									className="size-5 animate-spin text-primary"
									aria-hidden="true"
								/>
								Loading security bounties…
							</div>
						) : null}

						{ideasQuery.isError ? (
							<div className="field-panel mt-16 border-l-4 border-l-destructive p-8">
								<p className="text-destructive" role="alert">
									{ideasQuery.data === undefined
										? "Unable to load security bounties. Try again."
										: "Unable to refresh security bounties. Showing the latest available listings."}
								</p>
							</div>
						) : null}

						{ideasQuery.data?.length === 0 ? (
							<div className="field-panel mt-16 border-t-4 border-t-primary p-8 sm:p-12">
								<span className="grid size-12 place-items-center border border-primary/30 text-primary">
									<Sparkles className="size-6" aria-hidden="true" />
								</span>
								<h2 className="mt-5 text-3xl font-semibold tracking-tight">
									No security bounties yet
								</h2>
								<p className="mt-3 max-w-xl leading-7 text-muted-foreground">
									Be the first system owner to publish an authorized target,
									clear rules of engagement, and a reproducible proof standard.
								</p>
								<Link
									className={buttonVariants({ className: "mt-6 h-10 px-4" })}
									to="/ideas/new"
								>
									Publish a bounty
									<ArrowRight aria-hidden="true" />
								</Link>
							</div>
						) : null}

						{ideasQuery.data &&
						ideasQuery.data.length > 0 &&
						visibleIdeas.length === 0 ? (
							<div className="field-panel mt-12 border-t-4 border-t-primary p-8 sm:p-12">
								<span className="grid size-12 place-items-center border border-primary/30 text-primary">
									<Search className="size-6" aria-hidden="true" />
								</span>
								<h2 className="mt-5 text-3xl font-semibold tracking-tight">
									No security bounties match these filters
								</h2>
								<p className="mt-3 max-w-xl leading-7 text-muted-foreground">
									Try a broader search, choose another security area, or clear
									the filters.
								</p>
								<button
									className={buttonVariants({
										className: "mt-6 h-10 px-4",
										variant: "outline",
									})}
									onClick={clearFilters}
									type="button"
								>
									Clear filters
								</button>
							</div>
						) : null}

						{ideasQuery.data && visibleIdeas.length > 0 ? (
							<div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
								{visibleIdeas.map((idea) => {
									const cover = idea.media.find(
										(media) =>
											media.kind === "image" && isSafeImageUrl(media.url),
									);

									return (
										<article
											className="group relative overflow-hidden border border-border bg-card transition-colors hover:bg-muted/45"
											key={idea.id}
										>
											<Link
												aria-label={`View ${idea.title}`}
												className="absolute inset-0 z-[1] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
												to={`/ideas/${idea.slug}`}
											/>
											{cover ? (
												<div className="editorial-image-frame overflow-hidden">
													<img
														alt={cover.alt_text || idea.title}
														className="editorial-image aspect-[5/3] w-full object-cover transition duration-500 group-hover:scale-[1.025]"
														loading="lazy"
														src={cover.url}
													/>
												</div>
											) : null}
											<div className="flex min-h-72 flex-col p-6">
												<div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
													{idea.category ? (
														<span className="bg-signal px-2 py-1 font-mono text-[0.6875rem] tracking-[0.12em] text-black">
															{idea.category.name}
														</span>
													) : null}
													<span className="text-muted-foreground">
														{statusLabels[idea.status]}
													</span>
												</div>
												<h2 className="mt-5 text-2xl font-medium tracking-[-0.02em]">
													{idea.title}
												</h2>
												<p className="mt-3 flex-1 leading-7 text-muted-foreground">
													{idea.summary}
												</p>
												<div className="mt-7 flex items-center justify-between border-t border-primary/15 pt-5 text-sm text-muted-foreground">
													<p>
														By{" "}
														<Link
															className="relative z-10 font-semibold text-foreground underline decoration-primary/40 underline-offset-4"
															to={`/profiles/${idea.creator.username}`}
														>
															{idea.creator.display_name}
														</Link>
													</p>
													<div className="flex items-center gap-3">
														<p className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
															<UsersRound
																className="size-4"
																aria-hidden="true"
															/>
															{interestLabel(idea.interestCount)}
														</p>
														<ArrowUpRight
															className="size-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
															aria-hidden="true"
														/>
													</div>
												</div>
											</div>
										</article>
									);
								})}
							</div>
						) : null}
					</section>
				</div>
			</main>
		</>
	);
}
