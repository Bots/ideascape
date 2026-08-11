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
	LockKeyhole,
	Palette,
	RefreshCw,
	ShieldAlert,
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
		title: "Threats made explicit",
		description:
			"Define the asset, actor, abuse path, and consequence before proposing a control.",
	},
	{
		icon: Users,
		title: "Controls with boundaries",
		description:
			"State what is authorized, excluded, access-scoped, reversible, and owned.",
	},
	{
		icon: ShieldCheck,
		title: "Proof over confidence",
		description:
			"Precommit tests, stop conditions, independent checks, and residual risk before trust is earned.",
	},
];

const validationSteps = [
	{
		icon: Lightbulb,
		number: "01",
		title: "Frame the system",
		description:
			"Start with a private security brief that names the system, assets, operators, dependencies, and authority model.",
	},
	{
		icon: ShieldAlert,
		number: "02",
		title: "Map the threat scenario",
		description:
			"Name who or what could be harmed, how the system could fail or be abused, and which assumptions deserve the hardest questions.",
	},
	{
		icon: LockKeyhole,
		number: "03",
		title: "Set the control boundary",
		description:
			"Define consent, access, data, safety, ownership, rollback, and stop conditions before asking anyone to trust the control.",
	},
	{
		icon: Users,
		number: "04",
		title: "Publish the security brief",
		description:
			"Expose the threat scenario, control boundary, and proof standard for scoped review without granting access or deployment authority.",
	},
	{
		icon: ShieldCheck,
		number: "05",
		title: "Collect validation signals",
		description:
			"Use private reviewer intent and public aggregates to decide whether the security case deserves a bounded exercise.",
	},
	{
		icon: Wrench,
		number: "06",
		title: "Design a bounded pilot",
		description:
			"Define authorized participants, isolated assets, safeguards, measures, rollback, and stop conditions before any live exercise.",
	},
	{
		icon: ShieldAlert,
		number: "07",
		title: "Challenge the security case",
		description:
			"Invite a scoped adversarial review of abuse paths, control failures, recovery steps, and evidence before the pilot earns broader exposure.",
	},
	{
		icon: BookOpen,
		number: "08",
		title: "Publish what happened",
		description:
			"Share outcomes, limits, control failures, and residual risk without exposing reviewer activity or sensitive data.",
	},
	{
		icon: RefreshCw,
		number: "09",
		title: "Choose, repeat, or stop",
		description:
			"Use the evidence to refine one control, repeat inside the same authority boundary, pause, or close the brief without automatic promotion.",
	},
	{
		icon: Archive,
		number: "10",
		title: "Leave a useful record",
		description:
			"Preserve the threat model, controls, evidence, residual risks, decisions, and review date so future work inherits facts instead of confidence theater.",
	},
];

const ideaTerrains = [
	{
		icon: Palette,
		title: "Provenance & Authenticity",
		description:
			"Source integrity, consent, authenticity, and controlled reuse.",
		href: "/ideas?category=arts-culture",
	},
	{
		icon: Users,
		title: "Resilience & Response",
		description:
			"Private reporting, bounded authority, tested fallback, and incident recovery.",
		href: "/ideas?category=community",
	},
	{
		icon: GraduationCap,
		title: "Human Risk",
		description:
			"Adversarial training without credential capture, shame, or hidden surveillance.",
		href: "/ideas?category=education",
	},
	{
		icon: Leaf,
		title: "Infrastructure Integrity",
		description:
			"Fail-safe controls for sensors, utilities, repair, and physical systems.",
		href: "/ideas?category=environment",
	},
	{
		icon: HeartPulse,
		title: "Privacy & Safety",
		description:
			"Privacy-preserving controls for health, accessibility, and environmental safety.",
		href: "/ideas?category=health",
	},
	{
		icon: Cpu,
		title: "Software & Systems",
		description:
			"Supply chains, devices, recovery, compute, and model operations.",
		href: "/ideas?category=technology",
	},
];

const participationPaths = [
	{
		icon: Lightbulb,
		title: "Submit a system",
		description:
			"Draft the assets, trust boundaries, abuse paths, and authority assumptions that need review.",
		action: "Draft a security brief",
		href: "/ideas/new",
	},
	{
		icon: HeartHandshake,
		title: "Challenge a control",
		description:
			"Review threat models, identify bypasses, and state whether you can test or operate the control.",
		action: "Review security briefs",
		href: "/ideas",
	},
	{
		icon: BookOpen,
		title: "Contribute evidence",
		description:
			"Add standards, incident patterns, reproducible test methods, and explicit stop conditions.",
		action: "Join the security review",
		href: "/sign-up",
	},
];

const proofQuestions = [
	{
		number: "01",
		title: "What can fail or be abused?",
		description:
			"Name the asset, actor, entry point, trust violation, and credible consequence.",
	},
	{
		number: "02",
		title: "What authority is excluded?",
		description:
			"Make production access, data collection, custody, payment, and deployment authority explicit.",
	},
	{
		number: "03",
		title: "How does the control fail safely?",
		description:
			"Define isolation, least privilege, rollback, recovery, and the condition that stops the exercise.",
	},
	{
		number: "04",
		title: "What evidence earns trust?",
		description:
			"Precommit reproducible checks and residual-risk criteria before a control can advance.",
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
								Threats before trust
							</p>
							<h1 className="max-w-3xl text-balance text-5xl font-light leading-[0.98] tracking-[-0.04em] sm:text-7xl lg:text-[5.25rem]">
								Pressure-test security{" "}
								<span className="text-signal">before it ships.</span>
							</h1>
							<p className="mt-8 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
								Ideascape is a security validation lab for early systems.
								Operators publish a concrete threat scenario, control boundary,
								and proof standard before any pilot earns trust.
							</p>
							<p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
								Review software, infrastructure, identity, human-risk, privacy,
								and provenance briefs built to expose failure paths—not collect
								applause.
							</p>
							<div className="mt-10 flex flex-wrap items-center gap-3">
								<Link
									className={buttonVariants({
										size: "lg",
										className: "px-6",
									})}
									to="/ideas/new"
								>
									Draft a security brief
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
									Review security briefs
								</Link>
								<a
									className={buttonVariants({
										size: "lg",
										variant: "ghost",
										className: "px-5 text-primary",
									})}
									href="#idea-terrain-heading"
								>
									Browse security domains
									<ArrowRight aria-hidden="true" />
								</a>
							</div>

							<dl className="mt-12 grid max-w-2xl grid-cols-2 border border-border bg-muted/65 sm:grid-cols-[1fr_1fr_1.35fr]">
								<div className="border-b border-r border-border p-4 sm:border-b-0">
									<dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Security briefs
									</dt>
									<dd className="mt-1 text-3xl font-semibold tracking-tight">
										27
									</dd>
								</div>
								<div className="border-b border-border p-4 sm:border-b-0 sm:border-r">
									<dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Security domains
									</dt>
									<dd className="mt-1 text-3xl font-semibold tracking-tight">
										6
									</dd>
								</div>
								<div className="col-span-2 p-4 sm:col-span-1">
									<dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Method
									</dt>
									<dd className="mt-2 text-sm font-medium">
										Threat. Control. Proof.
									</dd>
								</div>
							</dl>
						</div>

						<div className="relative mx-auto w-full max-w-[39rem] pb-10 lg:pb-0">
							<div className="absolute -left-5 -top-5 hidden h-full w-full border border-primary/35 bg-primary/8 lg:block" />
							<figure className="relative overflow-hidden border border-signal bg-card p-2">
								<div className="mb-2 flex items-center justify-between border-b border-border px-1 pb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
									<span>Field sample / 027</span>
									<span className="text-foreground">Permission checked</span>
								</div>
								<div className="editorial-image-frame">
									<img
										alt="A software maintainer verifies signed dependencies in an isolated build environment"
										className="editorial-image aspect-[4/3] w-full object-cover"
										src="/images/ideas/software-supply-chain-clinic.svg"
									/>
								</div>
								<figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between border border-border bg-card px-4 py-3 text-sm">
									<span className="font-semibold">
										Software Supply Chain Clinic
									</span>
									<span className="bg-signal px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wider text-black">
										Software &amp; Systems
									</span>
								</figcaption>
							</figure>
							<div className="absolute -bottom-5 -left-5 hidden w-[44%] border border-border bg-card p-1.5 sm:block">
								<div className="editorial-image-frame">
									<img
										alt="An operator reviews a contained phishing drill with credential capture disabled"
										className="editorial-image aspect-video w-full object-cover"
										src="/images/ideas/phishing-drill-library.svg"
									/>
								</div>
							</div>
							<div className="absolute -right-4 top-10 flex items-center gap-2 border border-border bg-card px-4 py-3 text-sm font-semibold">
								<ShieldCheck
									className="size-5 text-primary"
									aria-hidden="true"
								/>
								Threats mapped. Controls bounded.
							</div>
						</div>
					</section>

					<section aria-labelledby="idea-terrain-heading" className="py-20">
						<div className="grid gap-8 border-x border-b border-border bg-background p-7 sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-12">
							<div>
								<p className="field-label">Six attack surfaces</p>
								<h2
									className="mt-4 max-w-xl text-4xl font-light tracking-[-0.025em] sm:text-5xl"
									id="idea-terrain-heading"
								>
									Security domains under review
								</h2>
								<p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
									Ideascape covers digital and physical systems where weak
									authority boundaries, unverifiable claims, or unsafe failure
									modes can create real harm.
								</p>
								<div className="mt-8 border-l-2 border-signal pl-4">
									<p className="font-semibold">
										27 security briefs across 6 domains
									</p>
									<p className="mt-1 text-sm leading-6 text-muted-foreground">
										Every brief names a threat scenario, control boundary, and
										proof required before a larger test.
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
									<p className="field-label">From threat to evidence</p>
									<h2
										className="mt-3 text-4xl font-light tracking-[-0.025em] sm:text-5xl"
										id="how-it-works-heading"
									>
										The security validation path
									</h2>
									<p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
										Start with a credible threat, not a confidence claim. Every
										control advances through explicit authority and proof gates.
									</p>
								</div>
								<Link
									className={buttonVariants({
										variant: "outline",
										className: "h-11 bg-background/70 px-5",
									})}
									to="/ideas"
								>
									Review the security catalog
									<ArrowRight aria-hidden="true" />
								</Link>
							</div>
							<div className="grid md:grid-cols-2 xl:grid-cols-5">
								{validationSteps.map(
									({ icon: Icon, number, title, description }) => (
										<article
											className="relative border-b border-border p-7 last:border-b-0 sm:p-9 md:border-r md:even:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0 xl:even:border-r xl:[&:nth-child(5n)]:border-r-0 xl:[&:nth-last-child(-n+5)]:border-b-0"
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
										Current security review
									</div>
									<h2
										className="mt-5 max-w-3xl text-4xl font-light tracking-[-0.025em] sm:text-6xl"
										id="participation-heading"
									>
										Ways to challenge a brief
									</h2>
									<p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-300">
										Draft a threat model, challenge a control boundary, or add
										reproducible evidence. Review never grants production
										access, deployment authority, payment, or custody.
									</p>
								</div>
								<aside className="border border-neutral-500 bg-neutral-950 p-6">
									<p className="text-xs font-bold uppercase tracking-[0.18em] text-signal">
										Good security review looks like
									</p>
									<p className="mt-3 text-base leading-7 text-neutral-200">
										Name a bypass. Challenge an assumption. Cite a standard.
										Define a reproducible check. Make the next decision
										safer—not merely more confident.
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
													You&apos;re reviewing
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
										stronger security case
									</p>
									<h2
										className="mt-5 max-w-3xl text-4xl font-light tracking-[-0.025em] sm:text-6xl"
										id="proof-heading"
									>
										Proof before scale
									</h2>
									<p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
										A validation signal is not permission to deploy. Every
										security brief must tighten its evidence, authority
										boundary, recovery path, and stop conditions as it advances.
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
									A security brief can stop, change direction, or remain a
									useful review record. Nothing advances automatically, and
									validation never grants permission to use private data,
									property, accounts, or production systems.
								</p>
							</div>
						</div>
					</section>

					<section aria-labelledby="principles-heading" className="pb-10">
						<div className="mb-6 flex items-end justify-between gap-4 border-t border-primary/20 pt-10">
							<div>
								<p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
									Security operating principles
								</p>
								<h2
									id="principles-heading"
									className="mt-2 text-3xl font-semibold tracking-tight"
								>
									From threat model to trusted control
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
