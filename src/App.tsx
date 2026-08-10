import {
	ArrowRight,
	HeartHandshake,
	Lightbulb,
	ShieldCheck,
	Sparkles,
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

const principles = [
	{
		icon: Lightbulb,
		title: "Ideas worth building",
		description:
			"Share a clear vision and discover whether a community believes in it.",
	},
	{
		icon: Users,
		title: "People-powered progress",
		description:
			"Turn early interest into collaborators, advocates, and evidence about demand.",
	},
	{
		icon: ShieldCheck,
		title: "Transparent by design",
		description:
			"Keep validation evidence visible now, then publish goals, milestones, releases, and updates if funding is activated later.",
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
			"Use aggregate demand—not private member activity—to decide whether to refine, pause, or prepare a more rigorous proposal.",
	},
];

const fundingSteps = [
	{
		icon: Lightbulb,
		number: "01",
		title: "Publish the terms",
		description:
			"A validated concept becomes a proposed campaign with a goal, deadline, milestones, evidence requirements, and refund rules everyone can inspect.",
	},
	{
		icon: Users,
		number: "02",
		title: "Choose a funding rail",
		description:
			"A future flow could support a self-custodied crypto wallet and compliant fiat on-ramps, with the network, asset, fees, and destination shown before approval.",
	},
	{
		icon: ShieldCheck,
		number: "03",
		title: "Milestone-based releases",
		description:
			"A reviewed contract would hold campaign funds against published rules and unlock only the approved amount for each documented milestone.",
	},
	{
		icon: HeartHandshake,
		number: "04",
		title: "Release or refund",
		description:
			"Successful milestones release a defined tranche. Cancellation, missed conditions, or a resolved dispute would follow the campaign's visible refund path.",
	},
];

const securityExamples = [
	{
		number: "01",
		title: "A milestone is claimed too early",
		risk: "A creator submits incomplete evidence and asks the contract to unlock the next tranche.",
		control:
			"A creator upload never releases funds automatically. Evidence enters a review window, a separate approver quorum signs, and an open dispute pauses execution.",
	},
	{
		number: "02",
		title: "A wallet prompt is tampered with",
		risk: "A malicious interface tries to substitute a different network, amount, asset, or contract address.",
		control:
			"The confirmation repeats the verified chain, asset, amount, fees, and destination before signing. Ideascape never requests seed phrases or private keys.",
	},
	{
		number: "03",
		title: "An admin key is compromised",
		risk: "One operator account is stolen and used to attempt a release, upgrade, or configuration change.",
		control:
			"No single operator controls funds. Separate roles, hardware-backed keys, multisig thresholds, least privilege, and on-chain logs limit the blast radius.",
	},
	{
		number: "04",
		title: "A contract bug is discovered",
		risk: "A vulnerability is found after deployment but before the campaign has completed.",
		control:
			"An independent audit, testnet simulations, version pinning, capped pilots, timelocked upgrades, and an emergency pause protect new deposits while preserving release or refund paths.",
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
			<main className="field-grid contour-field min-h-screen overflow-hidden text-foreground">
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
								Ideascape is a concept-validation platform where creators test
								demand, gather public interest, and learn what deserves deeper
								work before funding begins.
							</p>
							<p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
								The newest previews explore owner-authorized device work,
								consent-based file recovery, verified cloud exports, and private
								local AI.
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
								<Link
									className={buttonVariants({
										size: "lg",
										variant: "ghost",
										className: "px-5 text-primary",
									})}
									to="/ideas?category=technology"
								>
									Explore technology concepts
									<ArrowRight aria-hidden="true" />
								</Link>
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
										Fresh concepts ready to explore.
									</dd>
								</div>
							</dl>
						</div>

						<div className="relative mx-auto w-full max-w-[39rem] pb-10 lg:pb-0">
							<div className="absolute -left-5 -top-5 hidden h-full w-full border border-primary/35 bg-primary/8 lg:block" />
							<figure className="relative overflow-hidden border border-foreground/20 bg-card p-2">
								<div className="mb-2 flex items-center justify-between border-b border-border px-1 pb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
									<span>Field sample / 021</span>
									<span className="text-foreground">Permission checked</span>
								</div>
								<img
									alt="Owner-controlled devices, an open padlock, and a terminal share an isolated repair bench"
									className="editorial-image aspect-[4/3] w-full object-cover"
									src="/images/ideas/device-liberation-lab.svg"
								/>
								<figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between border border-border bg-card px-4 py-3 text-sm">
									<span className="font-semibold">Device Liberation Lab</span>
									<span className="bg-primary px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wider text-primary-foreground">
										Technology
									</span>
								</figcaption>
							</figure>
							<div className="absolute -bottom-5 -left-5 hidden w-[44%] border border-border bg-card p-1.5 sm:block">
								<img
									alt="A read-only recovery station transfers files from damaged storage into an encrypted folder"
									className="editorial-image aspect-video w-full object-cover"
									src="/images/ideas/file-rescue-cooperative.svg"
								/>
							</div>
							<div className="absolute -right-4 top-10 flex items-center gap-2 border border-border bg-card px-4 py-3 text-sm font-semibold">
								<ShieldCheck
									className="size-5 text-primary"
									aria-hidden="true"
								/>
								Permission-first technology
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
										Start with proof of demand, not a checkout. The live product
										is focused on learning what people actually want.
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
							<div className="grid md:grid-cols-3">
								{validationSteps.map(
									({ icon: Icon, number, title, description }) => (
										<article
											className="relative border-border p-7 md:border-r md:last:border-r-0 sm:p-9"
											key={title}
										>
											<div className="flex items-center justify-between">
												<span className="grid size-10 place-items-center border border-primary/30 text-primary">
													<Icon className="size-5" aria-hidden="true" />
												</span>
												<span className="font-mono text-xs font-semibold text-primary/55">
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
									),
								)}
							</div>
						</div>
					</section>

					<section aria-labelledby="planned-funding-heading" className="pb-20">
						<div className="relative overflow-hidden border border-neutral-500 bg-black text-white">
							<div className="relative grid gap-8 border-b border-white/10 p-7 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
								<div>
									<div className="inline-flex items-center gap-2 border-l-2 border-l-signal pl-3 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-signal">
										<Sparkles className="size-4" aria-hidden="true" />
										Planned, not live
									</div>
									<h2
										className="mt-5 max-w-3xl text-4xl font-light tracking-[-0.025em] sm:text-6xl"
										id="planned-funding-heading"
									>
										Planned smart-contract funding
									</h2>
									<p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-300">
										If a concept earns a campaign phase, the goal is to move
										from social proof to explicit, inspectable funding terms. No
										funds are accepted today.
									</p>
								</div>
								<aside className="border border-white/15 bg-white/5 p-6">
									<p className="text-xs font-bold uppercase tracking-[0.18em] text-signal">
										Design status
									</p>
									<p className="mt-3 text-base leading-7 text-neutral-200">
										Chain, asset, and governance design have not been selected.
										Any funding system would require security, legal, and pilot
										review before launch.
									</p>
								</aside>
							</div>

							<div className="relative grid border-b border-white/10 sm:grid-cols-2 lg:grid-cols-4">
								{fundingSteps.map(
									({ icon: Icon, number, title, description }) => (
										<article
											className="border-white/10 p-7 sm:border-r sm:even:border-r-0 lg:even:border-r lg:last:border-r-0"
											key={title}
										>
											<div className="flex items-center justify-between">
												<span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/7 text-signal">
													<Icon className="size-5" aria-hidden="true" />
												</span>
												<span className="font-mono text-xs text-neutral-400">
													{number}
												</span>
											</div>
											<h3 className="mt-7 text-lg font-semibold">{title}</h3>
											<p className="mt-3 text-sm leading-7 text-neutral-300">
												{description}
											</p>
										</article>
									),
								)}
							</div>

							<div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:p-12">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.18em] text-signal">
										What the contract can—and cannot—do
									</p>
									<p className="mt-4 text-lg leading-8 text-neutral-200">
										Smart contracts can make agreed rules and fund movements
										easier to inspect. They do not replace identity, moderation,
										real-world milestone review, dispute handling, or legal
										responsibility.
									</p>
								</div>
								<ul className="grid gap-3 text-sm leading-6 text-neutral-300 sm:grid-cols-2">
									{[
										"Independent security review before any contract can hold funds",
										"Published source, addresses, release rules, and upgrade controls",
										"Multisig approvals, pause controls, and documented dispute windows",
										"Self-custodied signatures—never wallet seed phrases or private keys",
										"Clear fees, network, asset, and transaction status before signing",
										"Legal, tax, sanctions, privacy, and consumer-protection review",
									].map((guardrail) => (
										<li
											className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/4 p-4"
											key={guardrail}
										>
											<ShieldCheck
												className="mt-0.5 size-4 shrink-0 text-signal"
												aria-hidden="true"
											/>
											<span>{guardrail}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</section>

					<section aria-labelledby="security-heading" className="pb-20">
						<div className="field-panel p-7 sm:p-10 lg:p-12">
							<div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
								<div>
									<p className="field-label inline-flex items-center gap-2 border-l-2 border-primary pl-3">
										<ShieldCheck className="size-4" aria-hidden="true" />
										Threat model preview
									</p>
									<h2
										className="mt-5 max-w-3xl text-4xl font-light tracking-[-0.025em] sm:text-6xl"
										id="security-heading"
									>
										Security before custody
									</h2>
									<p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
										No custody is live. Every seeded concept applies the same
										claim policy by naming a threat scenario, control boundary,
										and proof required before expansion. The examples below show
										the failure paths a real funding design must handle before a
										contract, wallet connection, or fiat rail can reach
										production.
									</p>
								</div>
								<div className="max-w-sm border border-primary/25 bg-primary/6 p-5 text-sm leading-6 text-muted-foreground">
									<p className="font-semibold text-foreground">
										Security claim policy
									</p>
									<p className="mt-2">
										A control is not a guarantee until code, deployment
										settings, governance, tests, and external review all prove
										it.
									</p>
								</div>
							</div>

							<div className="mt-10 grid gap-4 lg:grid-cols-2">
								{securityExamples.map(({ number, title, risk, control }) => (
									<article
										className="overflow-hidden border border-border bg-card"
										key={title}
									>
										<div className="p-6 sm:p-7">
											<div className="flex items-center justify-between gap-4">
												<span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
													Threat scenario
												</span>
												<span className="font-mono text-xs font-semibold text-primary/55">
													{number}
												</span>
											</div>
											<h3 className="mt-4 text-2xl font-semibold tracking-tight">
												{title}
											</h3>
											<p className="mt-3 text-sm leading-7 text-muted-foreground">
												{risk}
											</p>
										</div>
										<div className="border-t border-primary/15 bg-primary/7 p-6 sm:p-7">
											<p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
												Example control design
											</p>
											<p className="mt-3 text-sm leading-7 text-foreground/85">
												{control}
											</p>
										</div>
									</article>
								))}
							</div>

							<div className="mt-6 border border-primary/25 bg-primary/5 p-6 sm:p-8">
								<p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
									Non-negotiable baseline
								</p>
								<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
									{[
										"Least-privilege roles and separated duties",
										"Multisig quorum for privileged actions",
										"Independent audits and reproducible deployments",
										"Timelocked changes with public notice",
										"On-chain monitoring and incident alerts",
										"Tested pause, recovery, dispute, and refund runbooks",
									].map((control) => (
										<div
											className="flex items-start gap-3 border border-border bg-background/65 p-4 text-sm leading-6"
											key={control}
										>
											<ShieldCheck
												className="mt-0.5 size-4 shrink-0 text-primary"
												aria-hidden="true"
											/>
											<span>{control}</span>
										</div>
									))}
								</div>
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
