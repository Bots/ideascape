import {
	Archive,
	ArrowRight,
	BookOpen,
	Cpu,
	GraduationCap,
	HeartHandshake,
	HeartPulse,
	Leaf,
	Lightbulb,
	Palette,
	RefreshCw,
	ShieldCheck,
	Sparkles,
	Users,
	Wrench,
} from "lucide-react";
import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { InterestModeNotice } from "@/components/interest-mode-notice";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { AuthNavigation } from "@/features/auth/auth-navigation";

const AdminPage = lazy(() =>
	import("@/features/admin/admin-page").then((module) => ({
		default: module.AdminPage,
	})),
);
const AuthCallbackPage = lazy(() =>
	import("@/features/auth/auth-callback-page").then((module) => ({
		default: module.AuthCallbackPage,
	})),
);
const AuthPage = lazy(() =>
	import("@/features/auth/auth-page").then((module) => ({
		default: module.AuthPage,
	})),
);
const IdeaDetailPage = lazy(() =>
	import("@/features/ideas/idea-detail-page").then((module) => ({
		default: module.IdeaDetailPage,
	})),
);
const IdeaDiscoveryPage = lazy(() =>
	import("@/features/ideas/idea-discovery-page").then((module) => ({
		default: module.IdeaDiscoveryPage,
	})),
);
const IdeaEditorPage = lazy(() =>
	import("@/features/ideas/idea-editor-page").then((module) => ({
		default: module.IdeaEditorPage,
	})),
);
const ProfilePage = lazy(() =>
	import("@/features/profiles/profile-page").then((module) => ({
		default: module.ProfilePage,
	})),
);
const PilotPage = lazy(() =>
	import("@/features/pilots/pilot-page").then((module) => ({
		default: module.PilotPage,
	})),
);

const principles = [
	{
		icon: Lightbulb,
		title: "Ideas worth testing",
		description:
			"Turn an early thought into a clear concept that other people can understand, question, and improve.",
	},
	{
		icon: Users,
		title: "People-powered learning",
		description:
			"Use public interest and practical feedback to learn who cares, what is missing, and what deserves a first test.",
	},
	{
		icon: ShieldCheck,
		title: "Transparent by design",
		description:
			"Keep assumptions, permissions, boundaries, evidence, and updates visible from the first draft through any future pilot.",
	},
];

const validationSteps = [
	{
		icon: Lightbulb,
		number: "01",
		title: "Shape the concept",
		description:
			"Start with a private draft that explains who the idea helps, what it would change, and how a first experiment could be measured.",
	},
	{
		icon: Users,
		number: "02",
		title: "Test public interest",
		description:
			"Publish a concept preview so people can explore it and signal interest. There is no payment or commitment at this stage.",
	},
	{
		icon: ShieldCheck,
		number: "03",
		title: "Turn signals into evidence",
		description:
			"Use aggregate demand—not private member activity—to decide whether to refine, pause, or prepare a small, permission-based pilot.",
	},
	{
		icon: Wrench,
		number: "04",
		title: "Design a bounded pilot",
		description:
			"Define the participants, permissions, safeguards, measures, and stop conditions before testing the idea in the real world.",
	},
	{
		icon: BookOpen,
		number: "05",
		title: "Publish what happened",
		description:
			"Share outcomes, limits, surprises, and participant feedback without exposing private member activity or sensitive data.",
	},
	{
		icon: ArrowRight,
		number: "06",
		title: "Choose the next move",
		description:
			"Use the evidence to refine, repeat, pause, or archive the concept. Nothing advances automatically and every decision stays explainable.",
	},
	{
		icon: RefreshCw,
		number: "07",
		title: "Repeat with intention",
		description:
			"If evidence supports another round, change one meaningful thing, keep the boundary small, and state what the next test is meant to resolve.",
	},
	{
		icon: Archive,
		number: "08",
		title: "Leave a useful record",
		description:
			"Whether the idea grows or stops, preserve the decisions, evidence, limits, and reusable lessons so others can build from honest work.",
	},
];

const ideaTerrains = [
	{
		icon: Palette,
		title: "Arts & Culture",
		description:
			"Creative uses for overlooked spaces, shared stories, and neighborhood events.",
		href: "/ideas?category=arts-culture",
	},
	{
		icon: Users,
		title: "Community",
		description:
			"Practical ways for neighbors to move, prepare, connect, and care for a place.",
		href: "/ideas?category=community",
	},
	{
		icon: GraduationCap,
		title: "Education",
		description:
			"Hands-on learning, skill sharing, and tools that make knowledge easier to keep.",
		href: "/ideas?category=education",
	},
	{
		icon: Leaf,
		title: "Environment",
		description:
			"Repair, reuse, cleaner infrastructure, and measurable local resilience.",
		href: "/ideas?category=environment",
	},
	{
		icon: HeartPulse,
		title: "Health",
		description:
			"Accessible, preventive ideas shaped around consent and everyday wellbeing.",
		href: "/ideas?category=health",
	},
	{
		icon: Cpu,
		title: "Technology",
		description:
			"Useful systems that respect ownership, privacy, safety, and human control.",
		href: "/ideas?category=technology",
	},
];

const participationPaths = [
	{
		icon: Lightbulb,
		title: "Bring a question",
		description:
			"Draft a problem worth understanding. You do not need a finished plan, a pitch deck, or an organization behind you.",
		action: "Start an idea",
		href: "/ideas/new",
	},
	{
		icon: HeartHandshake,
		title: "Signal what matters",
		description:
			"Explore concept previews and save the ones you would follow, use, support, or help test.",
		action: "Explore concepts",
		href: "/ideas",
	},
	{
		icon: BookOpen,
		title: "Add grounded context",
		description:
			"Help creators spot prior work, affected groups, practical constraints, and better ways to measure progress.",
		action: "Join the experiment",
		href: "/sign-up",
	},
];

const proofQuestions = [
	{
		number: "01",
		title: "Whose problem is this?",
		description:
			"Name the people affected and involve them before treating assumptions as needs.",
	},
	{
		number: "02",
		title: "What is the smallest useful test?",
		description:
			"Define a reversible first step that can teach something without pretending to be a finished program.",
	},
	{
		number: "03",
		title: "What must stay protected?",
		description:
			"Make consent, privacy, access, ownership, safety, and stop conditions explicit before testing.",
	},
	{
		number: "04",
		title: "What result changes the plan?",
		description:
			"Publish the evidence that would justify refining, expanding, pausing, or retiring the concept.",
	},
];

function HomePage() {
	const { user, isLoading: isAuthLoading } = useAuth();

	return (
		<>
			<SiteHeader
				account={<AuthNavigation />}
				showExplore={false}
				showStartIdea={false}
			/>
			<main className="min-h-screen overflow-hidden text-foreground">
				<div className="site-shell flex min-h-screen flex-col">
					<InterestModeNotice
						className="mt-5"
						showAction={!isAuthLoading && !user}
					/>

					<section className="grid flex-1 items-center gap-12 border-x border-b border-border bg-background/92 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-20">
						<div className="relative z-10">
							<p className="signal-label mb-6 border-l-2 border-signal pl-3">
								Test the possibility
							</p>
							<h1 className="max-w-3xl text-balance text-5xl font-light leading-[0.98] tracking-[-0.04em] sm:text-7xl lg:text-[5.25rem]">
								Great ideas deserve a place to{" "}
								<span className="text-signal">grow.</span>
							</h1>
							<p className="mt-8 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
								Ideascape is a public workshop for early ideas. Creators make
								their thinking clear, neighbors signal what matters, and useful
								feedback shapes the next small step.
							</p>
							<p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
								Explore cleaner air, safer streets, shared repair, practical
								learning, accessible tools, local culture, and technology that
								keeps people in control.
							</p>
							<div className="mt-10 flex flex-wrap items-center gap-3">
								<Link
									className={buttonVariants({
										size: "lg",
										className: "px-6",
									})}
									to="/ideas/new"
								>
									Start an idea
									<ArrowRight aria-hidden="true" />
								</Link>
								<Link
									className={buttonVariants({
										size: "lg",
										variant: "outline",
										className: "bg-card px-6",
									})}
									to="/ideas"
								>
									Explore ideas
								</Link>
								<a
									className={buttonVariants({
										size: "lg",
										variant: "ghost",
										className: "px-5 text-primary",
									})}
									href="#idea-terrain-heading"
								>
									Browse by category
									<ArrowRight aria-hidden="true" />
								</a>
							</div>

							<dl className="mt-12 grid max-w-2xl grid-cols-2 border border-border bg-muted/65 sm:grid-cols-[1fr_1fr_1.35fr]">
								<div className="border-b border-r border-border p-4 sm:border-b-0">
									<dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Concept previews
									</dt>
									<dd className="mt-1 text-3xl font-semibold tracking-tight">
										21
									</dd>
								</div>
								<div className="border-b border-border p-4 sm:border-b-0 sm:border-r">
									<dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Categories
									</dt>
									<dd className="mt-1 text-3xl font-semibold tracking-tight">
										6
									</dd>
								</div>
								<div className="col-span-2 p-4 sm:col-span-1">
									<dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Momentum
									</dt>
									<dd className="mt-2 text-sm font-medium">
										Local questions. Practical first tests.
									</dd>
								</div>
							</dl>
						</div>

						<div className="relative mx-auto w-full max-w-[39rem] pb-10 lg:pb-0">
							<div className="absolute -left-5 -top-5 hidden h-full w-full border border-primary/35 bg-primary/8 lg:block" />
							<figure className="relative overflow-hidden border border-signal bg-card p-2">
								<div className="mb-2 flex items-center justify-between border-b border-border px-1 pb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
									<span>Field sample / 021</span>
									<span className="text-foreground">Permission checked</span>
								</div>
								<div className="editorial-image-frame">
									<img
										alt="Neighbors prepare a library room with portable air cleaners"
										className="editorial-image aspect-[4/3] w-full object-cover"
										src="/images/ideas/clean-air-library.svg"
									/>
								</div>
								<figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between border border-border bg-card px-4 py-3 text-sm">
									<span className="font-semibold">The Clean Air Library</span>
									<span className="bg-signal px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wider text-black">
										Health
									</span>
								</figcaption>
							</figure>
							<div className="absolute -bottom-5 -left-5 hidden w-[44%] border border-border bg-card p-1.5 sm:block">
								<div className="editorial-image-frame">
									<img
										alt="A storefront becomes an evening gallery while neighbors gather outside"
										className="editorial-image aspect-video w-full object-cover"
										src="/images/ideas/after-dark-storefronts.svg"
									/>
								</div>
							</div>
							<div className="absolute -right-4 top-10 flex items-center gap-2 border border-border bg-card px-4 py-3 text-sm font-semibold">
								<ShieldCheck
									className="size-5 text-primary"
									aria-hidden="true"
								/>
								Practical ideas, clearer next steps
							</div>
						</div>
					</section>

					<section aria-labelledby="idea-terrain-heading" className="py-20">
						<div className="grid gap-8 border-x border-b border-border bg-background p-7 sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-12">
							<div>
								<p className="field-label">A wider field of view</p>
								<h2
									className="mt-4 max-w-xl text-4xl font-light tracking-[-0.025em] sm:text-5xl"
									id="idea-terrain-heading"
								>
									Ideas for everyday life
								</h2>
								<p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
									Ideascape is not built around one industry or one kind of
									creator. It is a place to make a local problem legible,
									compare possible approaches, and find the people who care
									enough to keep learning.
								</p>
								<div className="mt-8 border-l-2 border-signal pl-4">
									<p className="font-semibold">
										21 concepts across 6 categories
									</p>
									<p className="mt-1 text-sm leading-6 text-muted-foreground">
										Each preview names a practical next step and the boundaries
										that should remain in place.
									</p>
								</div>
							</div>
							<div className="grid border-l border-t border-border sm:grid-cols-2">
								{ideaTerrains.map(
									({ icon: Icon, title, description, href }) => (
										<Link
											className="group border-b border-r border-border bg-card p-6 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											key={title}
											to={href}
										>
											<div className="flex items-start justify-between gap-5">
												<span className="grid size-10 shrink-0 place-items-center border border-primary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
													<Icon className="size-5" aria-hidden="true" />
												</span>
												<ArrowRight
													className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
													aria-hidden="true"
												/>
											</div>
											<h3 className="mt-6 text-lg font-semibold">{title}</h3>
											<p className="mt-2 text-sm leading-6 text-muted-foreground">
												{description}
											</p>
										</Link>
									),
								)}
							</div>
						</div>
					</section>

					<section aria-labelledby="how-it-works-heading" className="pb-20">
						<div className="field-panel overflow-hidden">
							<div className="grid gap-6 border-b border-border p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
								<div>
									<p className="field-label">From idea to evidence</p>
									<h2
										className="mt-3 text-4xl font-light tracking-[-0.025em] sm:text-5xl"
										id="how-it-works-heading"
									>
										How Ideascape works
									</h2>
									<p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
										Start with a clear question, not a polished pitch. The live
										product is focused on learning what people actually want.
									</p>
								</div>
								<Link
									className={buttonVariants({
										variant: "outline",
										className: "h-11 bg-background/70 px-5",
									})}
									to="/ideas"
								>
									Explore the live experiment
									<ArrowRight aria-hidden="true" />
								</Link>
							</div>
							<div className="grid md:grid-cols-2 xl:grid-cols-4">
								{validationSteps.map(
									({ icon: Icon, number, title, description }) => (
										<article
											className="relative border-b border-border p-7 last:border-b-0 sm:p-9 md:border-r md:even:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0 xl:even:border-r xl:[&:nth-child(4n)]:border-r-0 xl:[&:nth-last-child(-n+4)]:border-b-0"
											key={title}
										>
											<div className="flex items-center justify-between">
												<span className="grid size-10 place-items-center border border-signal bg-signal text-black">
													<Icon className="size-5" aria-hidden="true" />
												</span>
												<div className="flex items-center gap-3">
													<span className="font-mono text-xs font-semibold text-primary/55">
														{number}
													</span>
												</div>
											</div>
											<h3 className="mt-8 text-xl font-semibold tracking-tight">
												{title}
											</h3>
											<p className="mt-3 text-sm leading-7 text-muted-foreground">
												{description}
											</p>
										</article>
									),
								)}
							</div>
						</div>
					</section>

					<section aria-labelledby="participation-heading" className="pb-20">
						<div className="overflow-hidden border border-neutral-500 bg-black text-white">
							<div className="grid gap-8 border-b border-neutral-500 p-7 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
								<div>
									<div className="inline-flex items-center gap-2 border-l-2 border-l-signal pl-3 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-signal">
										<Sparkles className="size-4" aria-hidden="true" />
										Current invitation
									</div>
									<h2
										className="mt-5 max-w-3xl text-4xl font-light tracking-[-0.025em] sm:text-6xl"
										id="participation-heading"
									>
										Ways to take part
									</h2>
									<p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-300">
										The live product is for learning together: drafting
										concepts, discovering shared interest, and improving the
										quality of a possible first test. There are no payments or
										fundraising.
									</p>
								</div>
								<aside className="border border-neutral-500 bg-neutral-950 p-6">
									<p className="text-xs font-bold uppercase tracking-[0.18em] text-signal">
										Good participation looks like
									</p>
									<p className="mt-3 text-base leading-7 text-neutral-200">
										Ask a useful question. Share relevant experience. Name a
										constraint. Introduce someone affected. Help make the next
										decision more informed—not merely more popular.
									</p>
								</aside>
							</div>
							<div className="grid lg:grid-cols-3">
								{participationPaths.map(
									({ icon: Icon, title, description, action, href }) => (
										<article
											className="flex flex-col border-b border-neutral-500 p-7 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
											key={title}
										>
											<span className="grid size-11 place-items-center border border-neutral-500 text-signal">
												<Icon className="size-5" aria-hidden="true" />
											</span>
											<h3 className="mt-7 text-xl font-semibold">{title}</h3>
											<p className="mt-3 flex-1 text-sm leading-7 text-neutral-300">
												{description}
											</p>
											{href === "/sign-up" && user ? (
												<span className="mt-7 inline-flex min-h-11 items-center border border-neutral-500 px-4 text-sm font-semibold text-neutral-200">
													You&apos;re participating
												</span>
											) : (
												<Link
													className="mt-7 inline-flex min-h-11 items-center justify-between border border-neutral-500 px-4 text-sm font-semibold transition-colors hover:border-signal hover:bg-signal hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
													to={href}
												>
													{action}
													<ArrowRight className="size-4" aria-hidden="true" />
												</Link>
											)}
										</article>
									),
								)}
							</div>
						</div>
					</section>

					<section aria-labelledby="proof-heading" className="pb-20">
						<div className="field-panel overflow-hidden">
							<div className="grid gap-8 border-b border-border p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-12">
								<div>
									<p className="field-label inline-flex items-center gap-2 border-l-2 border-primary pl-3">
										<ShieldCheck className="size-4" aria-hidden="true" />A
										stronger concept
									</p>
									<h2
										className="mt-5 max-w-3xl text-4xl font-light tracking-[-0.025em] sm:text-6xl"
										id="proof-heading"
									>
										Proof before scale
									</h2>
									<p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
										Interest is a starting signal, not permission to expand.
										Every concept should become more specific about people,
										evidence, boundaries, and stop conditions as it develops.
									</p>
								</div>
								<Link
									className={buttonVariants({
										variant: "outline",
										className: "h-11 bg-background px-5",
									})}
									to="/ideas"
								>
									See the questions in practice
									<ArrowRight aria-hidden="true" />
								</Link>
							</div>
							<div className="grid md:grid-cols-2">
								{proofQuestions.map(({ number, title, description }) => (
									<article
										className="border-b border-border p-7 last:border-b-0 md:p-9 md:even:border-l md:[&:nth-last-child(-n+2)]:border-b-0"
										key={title}
									>
										<div className="flex items-center justify-between gap-4">
											<span className="font-mono text-xs font-semibold text-primary">
												Question {number}
											</span>
											<Wrench
												className="size-4 text-muted-foreground"
												aria-hidden="true"
											/>
										</div>
										<h3 className="mt-5 text-2xl font-semibold tracking-tight">
											{title}
										</h3>
										<p className="mt-3 text-sm leading-7 text-muted-foreground">
											{description}
										</p>
									</article>
								))}
							</div>
							<div className="grid gap-4 border-t border-border bg-muted p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
								<span className="grid size-11 place-items-center bg-primary text-primary-foreground">
									<ShieldCheck className="size-5" aria-hidden="true" />
								</span>
								<p className="max-w-4xl text-sm leading-7 text-foreground">
									A concept can stop, change direction, or remain a useful
									public record. Nothing graduates automatically, and
									participation never grants permission to use private data,
									property, accounts, or community identity.
								</p>
							</div>
						</div>
					</section>

					<section aria-labelledby="principles-heading" className="pb-10">
						<div className="mb-6 flex items-end justify-between gap-4 border-t border-primary/20 pt-10">
							<div>
								<p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
									Built for momentum
								</p>
								<h2
									id="principles-heading"
									className="mt-2 text-3xl font-semibold tracking-tight"
								>
									From possibility to progress
								</h2>
							</div>
						</div>
						<div className="grid gap-4 md:grid-cols-3">
							{principles.map(({ icon: Icon, title, description }, index) => (
								<article
									className="group border border-border bg-card p-6 transition-colors hover:border-primary hover:bg-muted/50"
									key={title}
								>
									<div className="flex items-center justify-between">
										<span className="grid size-10 place-items-center border border-primary/30 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
											<Icon className="size-5" aria-hidden="true" />
										</span>
										<span className="text-sm font-semibold text-primary/45">
											0{index + 1}
										</span>
									</div>
									<h3 className="mt-6 text-lg font-semibold">{title}</h3>
									<p className="mt-2 text-sm leading-6 text-muted-foreground">
										{description}
									</p>
								</article>
							))}
						</div>
					</section>
				</div>
			</main>
		</>
	);
}

function App() {
	return (
		<Suspense fallback={<RouteLoadingFallback />}>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route
					path="/sign-in"
					element={<AuthPage key="sign-in" mode="sign-in" />}
				/>
				<Route
					path="/sign-up"
					element={<AuthPage key="sign-up" mode="sign-up" />}
				/>
				<Route path="/profiles/:username" element={<ProfilePage />} />
				<Route path="/ideas" element={<IdeaDiscoveryPage />} />
				<Route path="/ideas/new" element={<IdeaEditorPage />} />
				<Route path="/ideas/:ideaId/edit" element={<IdeaEditorPage />} />
				<Route path="/ideas/:slug" element={<IdeaDetailPage />} />
				<Route path="/pilots/:pilotSlug" element={<PilotPage />} />
				<Route path="/admin" element={<AdminPage />} />
				<Route path="/auth/callback" element={<AuthCallbackPage />} />
			</Routes>
		</Suspense>
	);
}

function RouteLoadingFallback() {
	return (
		<main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
			<p
				className="rounded-full border border-primary/20 bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm"
				role="status"
			>
				Loading page…
			</p>
		</main>
	);
}

export default App;
