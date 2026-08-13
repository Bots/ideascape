import { useQuery } from "@tanstack/react-query";
import {
	ArrowRight,
	Archive,
	CheckCircle2,
	ClipboardCheck,
	FlaskConical,
	type GitBranch,
	LockKeyhole,
	RefreshCcw,
	ShieldCheck,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { PilotReadinessPanel } from "@/features/pilots/pilot-readiness-panel";
import {
	getPilotPlan,
	type PilotStatus,
} from "@/features/pilots/pilot-service";

const statusLabels: Record<PilotStatus, string> = {
	validating: "Test-run readiness under review",
	recruiting: "Recruiting authorized reviewers",
	active: "Authorized test run active",
	completed: "Authorized test run completed",
	paused: "Authorized test run paused",
	archived: "Authorized test run archived",
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
		return <PilotStatusPage message="Loading authorized test-run plan…" />;
	}

	if (pilotQuery.isError) {
		return (
			<PilotStatusPage
				message="Unable to load the authorized test-run plan. Try again later."
				isError
			/>
		);
	}

	const pilot = pilotQuery.data;
	if (!pilot) {
		return (
			<PilotStatusPage
				heading="Test-run plan not found"
				message="This authorized test-run plan is unavailable or has not been published."
			/>
		);
	}

	const returnTo = `${location.pathname}${location.search}${location.hash}`;
	const signInPath = `/sign-in?${new URLSearchParams({ returnTo }).toString()}`;

	return (
		<>
			<SiteHeader
				exploreLabel="Security bounty"
				exploreTo="/ideas/project-time-capsule"
			/>
			<main className="min-h-screen overflow-hidden text-foreground">
				<div className="site-shell">
					<section className="border-x border-b border-border bg-background/94 px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
						<div className="max-w-4xl">
							<p className="signal-label inline-flex items-center gap-2 border-l-2 border-signal pl-3">
								<FlaskConical className="size-4" aria-hidden="true" />
								Authorized test run · plan 001
							</p>
							<h1 className="mt-6 text-balance text-5xl font-light leading-[1] tracking-[-0.035em] sm:text-7xl">
								{pilot.title}
							</h1>
							<p className="mt-7 max-w-3xl text-xl leading-9 text-muted-foreground">
								Try to expose secrets, private history, unlicensed material, or
								unreproducible builds in sponsor-approved archives—then prove
								the fix on a clean machine.
							</p>
							<div className="mt-8 inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-sm font-semibold">
								<ClipboardCheck
									className="size-4 text-primary"
									aria-hidden="true"
								/>
								{statusLabels[pilot.status]}
							</div>
						</div>
					</section>

					<section
						aria-label="Authorized test-run evidence targets"
						className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
					>
						<EvidenceTarget
							value={`${pilot.evidence_window_days}-day`}
							label="evidence window"
						/>
						<EvidenceTarget
							value={String(pilot.signal_goal)}
							label="readiness signals"
						/>
						<EvidenceTarget
							value={String(pilot.interview_goal)}
							label="reviewer interviews"
						/>
						<EvidenceTarget
							value={`${pilot.project_capacity}-project`}
							label="test capacity"
						/>
					</section>
					<PilotReadinessPanel pilotId={pilot.id} />

					<section
						aria-labelledby="decision-rules-heading"
						className="field-panel mt-12 border-t-4 border-t-primary p-7 sm:p-10"
					>
						<p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
							Test-run gates · precommitted
						</p>
						<h2
							className="mt-3 text-4xl font-semibold tracking-[-0.04em]"
							id="decision-rules-heading"
						>
							Close, revise, or proceed
						</h2>
						<p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
							A test run does not begin on confidence alone. Thresholds are
							published before recruitment so the decision is based on evidence.
						</p>
						<div className="mt-8 grid gap-4 lg:grid-cols-3">
							<DecisionCard
								icon={CheckCircle2}
								title="Continue"
								description={`${pilot.continue_participant_threshold} reviewers ready for an authorized test and ${pilot.continue_project_threshold} suitable authorized projects support a capped authorized test run.`}
							/>
							<DecisionCard
								icon={RefreshCcw}
								title="Revise"
								description={`Meaningful interest exists, but fewer than ${pilot.continue_participant_threshold} reviewers are ready for an authorized test or the proposed projects do not fit the safety boundary.`}
							/>
							<DecisionCard
								icon={Archive}
								title="Archive"
								description={`${pilot.archive_signal_ceiling} or fewer meaningful signals remain after deliberate outreach, so the bounty should close without an authorized test run.`}
							/>
						</div>
					</section>

					<section
						aria-labelledby="pilot-boundaries-heading"
						className="mt-12 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]"
					>
						<div className="border border-neutral-500 border-t-4 border-t-signal bg-black p-8 text-white sm:p-10">
							<ShieldCheck className="size-10 text-signal" aria-hidden="true" />
							<h2
								className="mt-5 text-3xl font-semibold"
								id="pilot-boundaries-heading"
							>
								Rules of engagement
							</h2>
							<p className="mt-4 leading-7 text-white/70">
								Written permission and sponsor-approved projects only. No
								third-party targets, real credentials, production intrusion,
								custody, payout, or deployment authority.
							</p>
						</div>
						<div className="field-panel p-7 sm:p-10">
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
								authorized test reviewers. ControlProof handles no payout or
								commitment.
							</p>
						</div>
					</section>

					<section className="field-panel my-12 border-l-4 border-l-primary p-7 sm:p-10">
						<div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
							<div>
								<p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
									Current gate
								</p>
								<h2 className="mt-3 text-3xl font-semibold tracking-tight">
									{pilot.status === "validating"
										? "Authorized test-run intake is not open yet"
										: pilot.status === "recruiting"
											? "Private test-run applications are open"
											: statusLabels[pilot.status]}
								</h2>
								<p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
									{pilot.status === "validating"
										? "ControlProof is collecting private readiness signals before inviting authorized test-run applications."
										: "One strong, authorized project per applicant. Intake remains capped and reversible."}
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
		</>
	);
}

function EvidenceTarget({ value, label }: { value: string; label: string }) {
	return (
		<section
			aria-label={`${value} ${label}`}
			className="field-panel border-t-2 border-t-primary p-5"
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
		<article className="border border-border bg-background/75 p-5">
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
