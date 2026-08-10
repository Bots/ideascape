import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	ArrowRight,
	Archive,
	CheckCircle2,
	ClipboardCheck,
	FlaskConical,
	type GitBranch,
	Lightbulb,
	LockKeyhole,
	RefreshCcw,
	ShieldCheck,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { PilotReadinessPanel } from "@/features/pilots/pilot-readiness-panel";
import {
	getPilotPlan,
	type PilotStatus,
} from "@/features/pilots/pilot-service";

const statusLabels: Record<PilotStatus, string> = {
	validating: "Validation underway",
	recruiting: "Recruiting a small pilot",
	active: "Pilot in progress",
	completed: "Pilot completed",
	paused: "Pilot paused",
	archived: "Pilot archived",
};

export function PilotPage() {
	const { pilotSlug = "" } = useParams<{ pilotSlug: string }>();
	const { user, isLoading: isAuthLoading } = useAuth();
	const location = useLocation();
	const pilotQuery = useQuery({
		queryKey: ["pilot-plan", pilotSlug],
		queryFn: () => getPilotPlan(pilotSlug),
		retry: false,
	});

	if (pilotQuery.isPending || isAuthLoading) {
		return <PilotStatusPage message="Loading pilot plan…" />;
	}

	if (pilotQuery.isError) {
		return (
			<PilotStatusPage
				message="Unable to load the pilot plan. Please try again later."
				isError
			/>
		);
	}

	const pilot = pilotQuery.data;
	if (!pilot) {
		return (
			<PilotStatusPage
				heading="Pilot plan not found"
				message="This pilot plan is unavailable or has not been published."
			/>
		);
	}

	const returnTo = `${location.pathname}${location.search}${location.hash}`;
	const signInPath = `/sign-in?${new URLSearchParams({ returnTo }).toString()}`;

	return (
		<main className="relative min-h-screen overflow-hidden text-foreground">
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.76_0.08_65_/_0.11)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.76_0.08_65_/_0.11)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
			<div className="pointer-events-none absolute -right-32 top-10 size-[32rem] rounded-full bg-primary/12 blur-3xl" />

			<div className="relative mx-auto max-w-6xl px-5 py-5 sm:px-8 lg:px-12">
				<header className="flex items-center justify-between gap-4 rounded-2xl border bg-card/85 px-4 py-3 shadow-[0_18px_60px_-35px_oklch(0.36_0.09_43_/_0.45)] backdrop-blur-xl sm:px-5">
					<Link className="flex items-center gap-3 font-semibold" to="/">
						<span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
							<Lightbulb className="size-5" aria-hidden="true" />
						</span>
						Ideascape
					</Link>
					<Link
						className={buttonVariants({
							variant: "outline",
							className: "bg-card/80",
						})}
						to="/ideas/project-time-capsule"
					>
						<ArrowLeft aria-hidden="true" />
						Concept preview
					</Link>
				</header>

				<section className="py-16 sm:py-20">
					<div className="max-w-4xl">
						<p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
							<FlaskConical className="size-4" aria-hidden="true" />
							Evidence before commitment
						</p>
						<h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-7xl">
							{pilot.title}
						</h1>
						<p className="mt-7 max-w-3xl text-xl leading-9 text-muted-foreground">
							Test whether authorized software projects can be preserved and
							rebuilt reproducibly on a clean machine—before treating the
							concept as an operating program.
						</p>
						<div className="mt-8 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-semibold shadow-sm">
							<ClipboardCheck
								className="size-4 text-primary"
								aria-hidden="true"
							/>
							{statusLabels[pilot.status]}
						</div>
					</div>
				</section>

				<section
					aria-label="Pilot evidence targets"
					className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
				>
					<EvidenceTarget
						value={`${pilot.evidence_window_days}-day`}
						label="evidence window"
					/>
					<EvidenceTarget
						value={String(pilot.signal_goal)}
						label="meaningful signals"
					/>
					<EvidenceTarget
						value={String(pilot.interview_goal)}
						label="participant interviews"
					/>
					<EvidenceTarget
						value={`${pilot.project_capacity}-project`}
						label="pilot capacity"
					/>
				</section>
				<PilotReadinessPanel pilotId={pilot.id} />

				<section
					aria-labelledby="decision-rules-heading"
					className="mt-12 rounded-[2rem] border bg-card/85 p-7 shadow-[0_28px_75px_-48px_oklch(0.32_0.08_43_/_0.6)] sm:p-10"
				>
					<p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
						Precommitted evaluation
					</p>
					<h2
						className="mt-3 text-4xl font-semibold tracking-[-0.04em]"
						id="decision-rules-heading"
					>
						Decision rules
					</h2>
					<p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
						The outcome is not decided by enthusiasm alone. These thresholds are
						published before recruitment so weak evidence cannot be reframed as
						a success later.
					</p>
					<div className="mt-8 grid gap-4 lg:grid-cols-3">
						<DecisionCard
							icon={CheckCircle2}
							title="Continue"
							description={`${pilot.continue_participant_threshold} qualified pilot participants and ${pilot.continue_project_threshold} suitable authorized projects support a capped pilot.`}
						/>
						<DecisionCard
							icon={RefreshCcw}
							title="Revise"
							description={`Meaningful interest exists, but fewer than ${pilot.continue_participant_threshold} people are prepared to participate or the proposed projects do not fit the safety boundary.`}
						/>
						<DecisionCard
							icon={Archive}
							title="Archive"
							description={`${pilot.archive_signal_ceiling} or fewer meaningful signals remain after deliberate outreach, so the concept should not absorb more work.`}
						/>
					</div>
				</section>

				<section
					aria-labelledby="pilot-boundaries-heading"
					className="mt-12 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]"
				>
					<div className="rounded-[2rem] bg-[linear-gradient(145deg,oklch(0.25_0.075_41),oklch(0.19_0.04_38))] p-8 text-white shadow-xl sm:p-10">
						<ShieldCheck
							className="size-10 text-orange-400"
							aria-hidden="true"
						/>
						<h2
							className="mt-5 text-3xl font-semibold"
							id="pilot-boundaries-heading"
						>
							Pilot boundaries
						</h2>
						<p className="mt-4 leading-7 text-white/70">
							Participant-authorized projects only. No credential bypass, system
							intrusion, custody, payment, or commitment.
						</p>
					</div>
					<div className="rounded-[2rem] border bg-card p-7 sm:p-10">
						<h3 className="text-xl font-semibold">
							Every proposed archive must exclude
						</h3>
						<ul className="mt-6 grid gap-4 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
							<BoundaryItem>Unauthorized proprietary source</BoundaryItem>
							<BoundaryItem>Private production data</BoundaryItem>
							<BoundaryItem>Secrets or live credentials</BoundaryItem>
							<BoundaryItem>
								Third-party systems without written authorization
							</BoundaryItem>
						</ul>
						<p className="mt-7 flex items-start gap-2 border-t pt-5 text-sm text-muted-foreground">
							<LockKeyhole
								className="mt-0.5 size-4 shrink-0 text-primary"
								aria-hidden="true"
							/>
							Application details will remain private to the applicant and
							authorized pilot operators. No payment or commitment.
						</p>
					</div>
				</section>

				<section className="my-12 rounded-[2rem] border border-primary/25 bg-[linear-gradient(120deg,var(--card),color-mix(in_oklch,var(--primary)_9%,var(--card)))] p-7 sm:p-10">
					<div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
								Current gate
							</p>
							<h2 className="mt-3 text-3xl font-semibold tracking-tight">
								{pilot.status === "validating"
									? "Pilot intake is not open yet"
									: pilot.status === "recruiting"
										? "Private pilot applications are open"
										: statusLabels[pilot.status]}
							</h2>
							<p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
								{pilot.status === "validating"
									? "Ideascape is collecting practical participation signals before inviting project applications."
									: "One strong, authorized project per member. Intake remains capped and reversible."}
							</p>
						</div>
						{pilot.status === "recruiting" && !user ? (
							<Link
								className={buttonVariants({ size: "lg", className: "h-12" })}
								to={signInPath}
							>
								Sign in to apply privately
								<ArrowRight aria-hidden="true" />
							</Link>
						) : null}
						{pilot.status === "recruiting" && user ? (
							<p className="rounded-xl border bg-background px-4 py-3 text-sm font-semibold">
								Application form ready for the next verified increment.
							</p>
						) : null}
					</div>
				</section>
			</div>
		</main>
	);
}

function EvidenceTarget({ value, label }: { value: string; label: string }) {
	return (
		<section
			aria-label={`${value} ${label}`}
			className="rounded-2xl border bg-card/90 p-5 shadow-sm"
		>
			<p className="text-3xl font-semibold tracking-tight text-primary">
				{value}
			</p>
			<p className="mt-1 text-sm font-medium capitalize text-muted-foreground">
				{label}
			</p>
		</section>
	);
}

function DecisionCard({
	icon: Icon,
	title,
	description,
}: {
	icon: typeof GitBranch;
	title: string;
	description: string;
}) {
	return (
		<article className="rounded-2xl border bg-background/75 p-5">
			<Icon className="size-6 text-primary" aria-hidden="true" />
			<h3 className="mt-4 text-xl font-semibold">{title}</h3>
			<p className="mt-2 text-sm leading-6 text-muted-foreground">
				{description}
			</p>
		</article>
	);
}

function BoundaryItem({ children }: { children: React.ReactNode }) {
	return (
		<li className="flex items-start gap-3">
			<span
				className="mt-2 size-2 shrink-0 rounded-full bg-primary"
				aria-hidden="true"
			/>
			{children}
		</li>
	);
}

function PilotStatusPage({
	heading,
	message,
	isError = false,
}: {
	heading?: string;
	message: string;
	isError?: boolean;
}) {
	return (
		<main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
			<section className="max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm">
				{heading ? <h1 className="text-3xl font-semibold">{heading}</h1> : null}
				<p
					className="mt-3 text-muted-foreground"
					role={isError ? "alert" : "status"}
				>
					{message}
				</p>
				{heading ? (
					<Link
						className={buttonVariants({ className: "mt-6" })}
						to="/ideas/project-time-capsule"
					>
						Back to Project Time Capsule
					</Link>
				) : null}
			</section>
		</main>
	);
}
