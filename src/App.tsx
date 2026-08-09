import { ArrowRight, Lightbulb, ShieldCheck, Users } from "lucide-react";
import { Link, Route, Routes } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthCallbackPage } from "@/features/auth/auth-callback-page";
import { AuthNavigation } from "@/features/auth/auth-navigation";
import { AuthPage } from "@/features/auth/auth-page";
import { ProfilePage } from "@/features/profiles/profile-page";

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
		<main className="relative min-h-screen overflow-hidden bg-background text-foreground">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.84_0.12_155_/_0.3),transparent_34%),radial-gradient(circle_at_80%_10%,oklch(0.82_0.11_250_/_0.22),transparent_30%)]" />

			<div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-10">
				<header className="flex items-center justify-between">
					<Link
						className="flex items-center gap-3 font-semibold tracking-tight"
						to="/"
					>
						<span className="grid size-9 place-items-center rounded-xl bg-foreground text-background">
							<Lightbulb className="size-5" aria-hidden="true" />
						</span>
						<span className="text-lg">Ideascape</span>
					</Link>
					<div className="flex items-center gap-3">
						<span className="hidden rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur lg:inline-flex">
							Building in public
						</span>
						<AuthNavigation />
					</div>
				</header>

				<section className="flex flex-1 flex-col justify-center py-24 lg:py-32">
					<div className="max-w-4xl">
						<p className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
							Back the possibility
						</p>
						<h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
							Great ideas deserve a place to grow.
						</h1>
						<p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
							Ideascape is a community funding platform where ambitious ideas
							meet the people ready to help make them real.
						</p>
						<div className="mt-10 flex flex-wrap items-center gap-4">
							<Button size="lg" disabled>
								Explore ideas
								<ArrowRight aria-hidden="true" />
							</Button>
							<p className="text-sm text-muted-foreground">
								The first ideas are taking shape.
							</p>
						</div>
					</div>
				</section>

				<section
					aria-labelledby="principles-heading"
					className="border-t py-10"
				>
					<h2 id="principles-heading" className="sr-only">
						Ideascape principles
					</h2>
					<div className="grid gap-8 md:grid-cols-3 md:gap-12">
						{principles.map(({ icon: Icon, title, description }) => (
							<article key={title}>
								<Icon className="mb-4 size-5" aria-hidden="true" />
								<h3 className="font-semibold">{title}</h3>
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
			<Route path="/auth/callback" element={<AuthCallbackPage />} />
		</Routes>
	);
}

export default App;
