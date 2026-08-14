import {
	Archive,
	ArrowRight,
	BookOpen,
	Cpu,
	GraduationCap,
	HeartPulse,
	Leaf,
	LockKeyhole,
	Palette,
	ShieldAlert,
	ShieldCheck,
	Users,
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

const workflow = [
	{
		number: "01",
		icon: BookOpen,
		title: "Publish the security bounty",
		description:
			"The system owner identifies the target, confirms written authorization, and describes the security problem.",
	},
	{
		number: "02",
		icon: ShieldAlert,
		title: "Define scope and proof",
		description:
			"The bounty states the attack scenario, rules of engagement, excluded assets, stop conditions, and proof required.",
	},
	{
		number: "03",
		icon: Users,
		title: "Gather private readiness",
		description:
			"Reviewers can leave private signals. System owners see aggregate evidence, never individual response histories.",
	},
	{
		number: "04",
		icon: LockKeyhole,
		title: "Run an authorized test",
		description:
			"Testing begins only after the target, participants, environment, and stop conditions are explicitly approved.",
	},
	{
		number: "05",
		icon: ShieldCheck,
		title: "Verify and close",
		description:
			"A reproducible finding and independent retest determine whether to fix, repeat, pause, or close the bounty.",
	},
];

const securityAreas = [
	{
		icon: Palette,
		title: "Provenance & Forgery",
		description:
			"Source integrity, consent, authenticity, and controlled reuse.",
		href: "/ideas?category=arts-culture",
	},
	{
		icon: Users,
		title: "Coordination & Resilience",
		description:
			"Private reporting, bounded authority, tested fallback, and incident recovery.",
		href: "/ideas?category=community",
	},
	{
		icon: GraduationCap,
		title: "Human Attack Surface",
		description:
			"Adversarial training without credential capture, shame, or hidden surveillance.",
		href: "/ideas?category=education",
	},
	{
		icon: Leaf,
		title: "Physical & Sensor Systems",
		description:
			"Fail-safe controls for sensors, utilities, repair, and physical systems.",
		href: "/ideas?category=environment",
	},
	{
		icon: HeartPulse,
		title: "Privacy & Safety",
		description:
			"Privacy-preserving controls for health, accessibility, and sensitive data.",
		href: "/ideas?category=health",
	},
	{
		icon: Cpu,
		title: "Software & Compute",
		description:
			"Supply chains, devices, recovery, compute isolation, and model operations.",
		href: "/ideas?category=technology",
	},
];

const boundaries = [
	{
		title: "ProofBoundary records",
		items: [
			"The authorized target and system owner",
			"Rules of engagement and stop conditions",
			"Private readiness signals as aggregate counts",
			"Reproducible findings, remediation, and retest evidence",
		],
	},
	{
		title: "ProofBoundary does not provide",
		items: [
			"Permission to access any target",
			"Production credentials or private data",
			"Payments, escrow, or guaranteed rewards",
			"Automatic approval to deploy or expand a test",
		],
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

					<section className="bounty-grid grid flex-1 items-center gap-12 border-x border-b border-border bg-background/92 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-20">
						<div className="relative z-10">
							<p className="signal-label mb-6 border-l-2 border-signal pl-3">
								Authorized security bounty platform
							</p>
							<h1 className="max-w-3xl text-balance text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-[5.25rem]">
								Test security with{" "}
								<span className="text-signal">scope and proof.</span>
							</h1>
							<p className="mt-8 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
								ProofBoundary helps system owners publish authorized security
								bounties and helps reviewers evaluate whether each one is ready
								for a controlled test.
							</p>
							<p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
								Every bounty defines the attack scenario, rules of engagement,
								and proof required. Written authorization is always separate
								from the listing itself.
							</p>
							<div className="mt-10 flex flex-wrap items-center gap-3">
								<Link
									className={buttonVariants({ size: "lg", className: "px-6" })}
									to="/ideas"
								>
									Browse security bounties
									<ArrowRight aria-hidden="true" />
								</Link>
								<Link
									className={buttonVariants({
										size: "lg",
										variant: "outline",
										className: "bg-card px-6",
									})}
									to="/ideas/new"
								>
									Publish a bounty
								</Link>
							</div>

							<dl className="mt-12 grid max-w-2xl grid-cols-2 border border-border bg-muted/65 sm:grid-cols-[1fr_1fr_1.35fr]">
								<div className="border-b border-r border-border p-4 sm:border-b-0">
									<dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Published bounties
									</dt>
									<dd className="mt-1 text-3xl font-semibold tracking-tight">
										27
									</dd>
								</div>
								<div className="border-b border-border p-4 sm:border-b-0 sm:border-r">
									<dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Security areas
									</dt>
									<dd className="mt-1 text-3xl font-semibold tracking-tight">
										6
									</dd>
								</div>
								<div className="col-span-2 p-4 sm:col-span-1">
									<dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Non-negotiable
									</dt>
									<dd className="mt-2 text-sm font-medium">
										No authorization, no test.
									</dd>
								</div>
							</dl>
						</div>

						<div className="relative mx-auto w-full max-w-[39rem] pb-8 lg:pb-0">
							<figure className="relative overflow-hidden border border-signal bg-card p-2">
								<div className="mb-2 flex items-center justify-between border-b border-border px-1 pb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
									<span>Security bounty / 027</span>
									<span className="text-foreground">
										Authorization required
									</span>
								</div>
								<div className="editorial-image-frame">
									<img
										alt="Dependency substitution security bounty in an isolated test environment"
										className="editorial-image aspect-[4/3] w-full object-cover"
										src="/images/ideas/software-supply-chain-clinic.svg"
									/>
								</div>
								<figcaption className="absolute bottom-4 left-4 right-4 border border-border bg-card px-4 py-3 text-sm">
									<p className="font-semibold">
										Dependency Substitution Bounty
									</p>
									<p className="mt-1 text-xs text-muted-foreground">
										Isolated build environment · reproducible retest required
									</p>
								</figcaption>
							</figure>
						</div>
					</section>

					<section aria-labelledby="workflow-heading" className="py-20">
						<div className="field-panel overflow-hidden">
							<div className="grid gap-6 border-b border-border p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
								<div>
									<p className="field-label">One workflow</p>
									<h2
										className="mt-3 text-4xl font-light tracking-[-0.025em] sm:text-5xl"
										id="workflow-heading"
									>
										From bounty to verified result
									</h2>
									<p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
										The same five steps apply across every security area.
									</p>
								</div>
								<Link
									className={buttonVariants({
										variant: "outline",
										className: "h-11 bg-background px-5",
									})}
									to="/ideas"
								>
									View current bounties
									<ArrowRight aria-hidden="true" />
								</Link>
							</div>
							<div className="grid md:grid-cols-2 xl:grid-cols-5">
								{workflow.map(({ number, icon: Icon, title, description }) => (
									<article
										className="relative border-b border-border p-7 last:border-b-0 md:border-r md:even:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0 xl:even:border-r xl:[&:nth-child(5n)]:border-r-0 xl:[&:nth-last-child(-n+5)]:border-b-0"
										key={title}
									>
										<div className="flex items-center justify-between">
											<span className="grid size-10 place-items-center border border-signal bg-signal text-black">
												<Icon className="size-5" aria-hidden="true" />
											</span>
											<span className="font-mono text-xs font-semibold text-foreground">
												{number}
											</span>
										</div>
										<h3 className="mt-8 text-xl font-semibold tracking-tight">
											{title}
										</h3>
										<p className="mt-3 text-sm leading-7 text-muted-foreground">
											{description}
										</p>
									</article>
								))}
							</div>
						</div>
					</section>

					<section aria-labelledby="security-areas-heading" className="pb-20">
						<div className="grid gap-8 border-x border-b border-border bg-background p-7 sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-12">
							<div>
								<p className="field-label">Six security areas</p>
								<h2
									className="mt-4 max-w-xl text-4xl font-light tracking-[-0.025em] sm:text-5xl"
									id="security-areas-heading"
								>
									Browse by system risk
								</h2>
								<p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
									Each area uses the same authorization, scope, privacy, and
									evidence requirements.
								</p>
							</div>
							<div className="grid border-l border-t border-border sm:grid-cols-2">
								{securityAreas.map(
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
													className="size-4 text-muted-foreground"
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

					<section aria-labelledby="boundaries-heading" className="pb-12">
						<div className="overflow-hidden border border-neutral-500 bg-black text-white">
							<div className="border-b border-neutral-500 p-7 sm:p-10 lg:p-12">
								<p className="inline-flex items-center gap-2 border-l-2 border-l-signal pl-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-signal">
									<ShieldCheck className="size-4" aria-hidden="true" />
									Platform boundary
								</p>
								<h2
									className="mt-5 max-w-3xl text-4xl font-light tracking-[-0.025em] sm:text-6xl"
									id="boundaries-heading"
								>
									Scope is visible. Authorization stays separate.
								</h2>
								<p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-300">
									A listing helps people evaluate a test. It never grants access
									to a system or permission to begin testing.
								</p>
							</div>
							<div className="grid lg:grid-cols-2">
								{boundaries.map(({ title, items }, index) => (
									<section
										className="border-b border-neutral-500 p-7 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 sm:p-10"
										key={title}
									>
										<div className="flex items-center gap-3">
											{index === 0 ? (
												<Archive
													className="size-5 text-signal"
													aria-hidden="true"
												/>
											) : (
												<LockKeyhole
													className="size-5 text-signal"
													aria-hidden="true"
												/>
											)}
											<h3 className="text-xl font-semibold">{title}</h3>
										</div>
										<ul className="mt-6 grid gap-3 text-sm leading-6 text-neutral-300">
											{items.map((item) => (
												<li className="flex gap-3" key={item}>
													<span
														className="mt-2 size-1.5 shrink-0 bg-signal"
														aria-hidden="true"
													/>
													{item}
												</li>
											))}
										</ul>
									</section>
								))}
							</div>
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
				className="border border-primary/20 bg-card px-4 py-2 text-sm font-medium text-muted-foreground"
				role="status"
			>
				Loading page…
			</p>
		</main>
	);
}

export default App;
