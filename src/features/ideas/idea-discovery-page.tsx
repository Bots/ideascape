import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	ArrowRight,
	ArrowUpRight,
	Lightbulb,
	LoaderCircle,
	Search,
	Sparkles,
	UsersRound,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { InterestModeNotice } from "@/components/interest-mode-notice";
import { buttonVariants } from "@/components/ui/button";
import {
	listPublishedIdeas,
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
		return "Be first to signal interest";
	}

	if (count === 1) {
		return "1 person interested";
	}

	return `${count} people interested`;
}

function conceptCountLabel(count: number): string {
	return `${count} demo ${count === 1 ? "concept" : "concepts"}`;
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
		<main className="relative min-h-screen overflow-hidden text-foreground">
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.76_0.08_65_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.76_0.08_65_/_0.1)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:linear-gradient(to_bottom,black,transparent_64%)]" />
			<div className="pointer-events-none absolute -right-40 top-24 size-[30rem] rounded-full bg-primary/12 blur-3xl" />

			<div className="relative mx-auto min-h-screen max-w-7xl px-5 py-5 sm:px-8 lg:px-12">
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
							className: "h-10 px-4 shadow-sm",
						})}
						to="/ideas/new"
					>
						Start an idea
						<ArrowRight aria-hidden="true" />
					</Link>
				</header>

				<section className="py-16 sm:py-24">
					<div className="grid items-end gap-8 border-b border-primary/20 pb-12 lg:grid-cols-[1fr_auto]">
						<div>
							<p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.19em] text-primary">
								<Sparkles className="size-4" aria-hidden="true" />
								Community possibilities
							</p>
							<h1 className="text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
								Discover <span className="text-primary">ideas</span>
							</h1>
							<p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
								Meet creators testing ambitious solutions and follow their
								progress from first proposal to real-world impact.
							</p>
						</div>
						<div className="hidden rounded-2xl border bg-card/75 px-6 py-5 shadow-sm lg:block">
							<p className="text-xs font-bold uppercase tracking-wider text-primary">
								Now exploring
							</p>
							<p className="mt-2 text-3xl font-semibold tracking-tight">
								{ideasQuery.data
									? conceptCountLabel(ideasQuery.data.length)
									: "Loading concepts"}
							</p>
						</div>
					</div>
					<InterestModeNotice className="mt-8" />

					{ideasQuery.data && ideasQuery.data.length > 0 ? (
						<fieldset className="mt-8 grid gap-4 rounded-2xl border bg-card/80 p-5 pr-16 shadow-sm lg:grid-cols-[1fr_17rem_auto] lg:items-end lg:pr-5">
							<legend className="sr-only">Filter concepts</legend>
							<label
								className="grid gap-2 text-sm font-semibold"
								htmlFor="concept-search"
							>
								Search concept previews
								<span className="relative block">
									<Search
										aria-hidden="true"
										className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
									/>
									<input
										className="h-11 w-full rounded-xl border bg-background pl-10 pr-3 text-base font-normal text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
										id="concept-search"
										onChange={(event) => updateSearch(event.target.value)}
										placeholder="Try files, firmware, or local AI"
										type="search"
										value={searchTerm}
									/>
								</span>
							</label>
							<label
								className="grid gap-2 text-sm font-semibold"
								htmlFor="category-filter"
							>
								Category
								<select
									className="h-11 w-full rounded-xl border bg-background px-3 text-base font-normal text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
									id="category-filter"
									onChange={(event) => updateCategory(event.target.value)}
									value={selectedCategory}
								>
									<option value="all">All categories</option>
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
								concepts
							</p>
						</fieldset>
					) : null}

					{ideasQuery.isPending ? (
						<div
							className="mt-16 flex items-center gap-3 rounded-2xl border bg-card/75 p-7 text-muted-foreground shadow-sm"
							role="status"
						>
							<LoaderCircle
								className="size-5 animate-spin text-primary"
								aria-hidden="true"
							/>
							Loading ideas…
						</div>
					) : null}

					{ideasQuery.isError ? (
						<div className="mt-16 rounded-2xl border bg-card/85 p-8 shadow-sm">
							<p className="text-destructive" role="alert">
								Unable to load ideas. Please try again.
							</p>
						</div>
					) : null}

					{ideasQuery.data?.length === 0 ? (
						<div className="mt-16 rounded-3xl border bg-card/85 p-8 shadow-[0_24px_70px_-40px_oklch(0.35_0.09_43_/_0.45)] sm:p-12">
							<span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
								<Sparkles className="size-6" aria-hidden="true" />
							</span>
							<h2 className="mt-5 text-3xl font-semibold tracking-tight">
								The first ideas are taking shape
							</h2>
							<p className="mt-3 max-w-xl leading-7 text-muted-foreground">
								Be the first creator to share a proposal with the Ideascape
								community.
							</p>
							<Link
								className={buttonVariants({ className: "mt-6 h-10 px-4" })}
								to="/ideas/new"
							>
								Start an idea
								<ArrowRight aria-hidden="true" />
							</Link>
						</div>
					) : null}

					{ideasQuery.data &&
					ideasQuery.data.length > 0 &&
					visibleIdeas.length === 0 ? (
						<div className="mt-12 rounded-3xl border bg-card/85 p-8 shadow-[0_24px_70px_-40px_oklch(0.35_0.09_43_/_0.45)] sm:p-12">
							<span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
								<Search className="size-6" aria-hidden="true" />
							</span>
							<h2 className="mt-5 text-3xl font-semibold tracking-tight">
								No concepts match these filters
							</h2>
							<p className="mt-3 max-w-xl leading-7 text-muted-foreground">
								Try a broader search, choose another category, or reset the
								catalog.
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
						<div className="mt-12 grid gap-7 md:grid-cols-2">
							{visibleIdeas.map((idea) => {
								const cover = idea.media.find(
									(media) =>
										media.kind === "image" && isSafeImageUrl(media.url),
								);

								return (
									<article
										className="group relative overflow-hidden rounded-3xl border bg-card/90 shadow-[0_22px_55px_-35px_oklch(0.32_0.08_43_/_0.55)] transition duration-300 hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-[0_30px_65px_-30px_oklch(0.54_0.16_39_/_0.38)]"
										key={idea.id}
									>
										<Link
											aria-label={`View ${idea.title}`}
											className="absolute inset-0 z-[1] rounded-3xl outline-none focus-visible:ring-3 focus-visible:ring-ring/70"
											to={`/ideas/${idea.slug}`}
										/>
										{cover ? (
											<div className="overflow-hidden">
												<img
													alt={cover.alt_text || idea.title}
													className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.035]"
													loading="lazy"
													src={cover.url}
												/>
											</div>
										) : null}
										<div className="flex min-h-[18rem] flex-col p-7">
											<div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
												{idea.category ? (
													<span className="rounded-full bg-primary/10 px-3 py-1.5 text-primary">
														{idea.category.name}
													</span>
												) : null}
												<span className="text-muted-foreground">
													{statusLabels[idea.status]}
												</span>
											</div>
											<h2 className="mt-5 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
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
														<UsersRound className="size-4" aria-hidden="true" />
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
	);
}
