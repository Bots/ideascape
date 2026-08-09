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
import { buttonVariants } from "@/components/ui/button";
import { AuthNavigation } from "@/features/auth/auth-navigation";

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
			"Turn early supporters into collaborators, advocates, and backers.",
	},
	{
		icon: ShieldCheck,
		title: "Transparent by design",
		description:
			"Build trust with visible goals, milestones, and accountable updates.",
	},
];

function HomePage() {
	return (
		<main className="relative min-h-screen overflow-hidden text-foreground">
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.76_0.08_65_/_0.12)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.76_0.08_65_/_0.12)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
			<div className="pointer-events-none absolute -top-48 right-[-14rem] size-[34rem] rounded-full bg-primary/15 blur-3xl" />

			<div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-12">
				<header className="flex items-center justify-between rounded-2xl border bg-card/80 px-4 py-3 shadow-[0_18px_60px_-35px_oklch(0.36_0.09_43_/_0.45)] backdrop-blur-xl sm:px-5">
					<Link
						className="flex items-center gap-3 font-semibold tracking-tight"
						to="/"
					>
						<span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_24px_-10px_oklch(0.57_0.2_39)]">
							<Lightbulb className="size-5" aria-hidden="true" />
						</span>
						<span className="text-lg">Ideascape</span>
					</Link>
					<div className="flex items-center gap-3">
						<span className="hidden rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary lg:inline-flex">
							Building in public
						</span>
						<AuthNavigation />
					</div>
				</header>
				<InterestModeNotice className="mt-5" showAction />

				<section className="grid flex-1 items-center gap-16 py-16 lg:grid-cols-[1.03fr_0.97fr] lg:gap-12 lg:py-20">
					<div className="relative z-10">
						<p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.19em] text-primary">
							<Sparkles className="size-4" aria-hidden="true" />
							Back the possibility
						</p>
						<h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.06em] sm:text-7xl lg:text-[5.45rem]">
							Great ideas deserve a place to{" "}
							<span className="text-primary">grow.</span>
						</h1>
						<p className="mt-8 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
							Ideascape is a community funding platform where ambitious ideas
							meet the people ready to help make them real.
						</p>
						<div className="mt-10 flex flex-wrap items-center gap-3">
							<Link
								className={buttonVariants({
									size: "lg",
									className:
										"h-12 px-6 text-base shadow-[0_14px_30px_-12px_oklch(0.57_0.2_39_/_0.75)] hover:-translate-y-0.5",
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
									className:
										"h-12 bg-card/75 px-6 text-base hover:-translate-y-0.5",
								})}
								to="/ideas"
							>
								Explore ideas
							</Link>
						</div>

						<dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-primary/15 pt-7">
							<div>
								<dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Concept previews
								</dt>
								<dd className="mt-1 text-3xl font-semibold tracking-tight">
									4
								</dd>
							</div>
							<div>
								<dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Categories
								</dt>
								<dd className="mt-1 text-3xl font-semibold tracking-tight">
									6
								</dd>
							</div>
							<div className="max-w-[13rem]">
								<dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Momentum
								</dt>
								<dd className="mt-2 text-sm font-medium">
									Fresh concepts ready to explore.
								</dd>
							</div>
						</dl>
					</div>

					<div className="relative mx-auto w-full max-w-[39rem] pb-12 lg:pb-0">
						<div className="absolute -left-8 top-16 hidden h-[74%] w-[88%] rotate-[-5deg] rounded-[2rem] bg-primary/20 lg:block" />
						<figure className="relative overflow-hidden rounded-[2rem] border-2 border-card bg-card p-2 shadow-[0_34px_80px_-28px_oklch(0.28_0.08_42_/_0.55)]">
							<img
								alt="Neighbors preparing a community clean-air library"
								className="aspect-[4/3] w-full rounded-[1.55rem] object-cover"
								src="/images/ideas/clean-air-library.svg"
							/>
							<figcaption className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-xl border border-white/40 bg-card/85 px-4 py-3 text-sm shadow-lg backdrop-blur-md">
								<span className="font-semibold">The Clean Air Library</span>
								<span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
									Health
								</span>
							</figcaption>
						</figure>
						<div className="absolute -bottom-5 -left-5 hidden w-[44%] rotate-[-4deg] rounded-2xl border-4 border-card bg-card p-1.5 shadow-2xl sm:block">
							<img
								alt="An after-dark storefront gallery"
								className="aspect-video w-full rounded-xl object-cover"
								src="/images/ideas/after-dark-storefronts.svg"
							/>
						</div>
						<div className="absolute -right-4 top-8 flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-semibold shadow-xl">
							<HeartHandshake
								className="size-5 text-primary"
								aria-hidden="true"
							/>
							Community-backed
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
								className="group rounded-2xl border bg-card/85 p-6 shadow-[0_18px_45px_-32px_oklch(0.32_0.08_43_/_0.5)] transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_24px_55px_-28px_oklch(0.55_0.16_39_/_0.42)]"
								key={title}
							>
								<div className="flex items-center justify-between">
									<span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
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
