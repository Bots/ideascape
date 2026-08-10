import { useQuery } from "@tanstack/react-query";
import { BarChart3, ClipboardCheck, LockKeyhole } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import {
	getPilotReadinessSummary,
	type PilotDecision,
} from "@/features/pilots/pilot-service";

const recommendationCopy: Record<
	PilotDecision,
	{ label: string; description: string }
> = {
	pending: {
		label: "Keep collecting evidence",
		description:
			"The evidence window is still open and the continue thresholds have not both been met.",
	},
	continue: {
		label: "Continue threshold met",
		description:
			"Participant and suitable-project evidence support preparing the published capped pilot.",
	},
	revise: {
		label: "Revise before advancing",
		description:
			"The evidence window closed above the archive ceiling, but one or more continue thresholds remain unmet.",
	},
	pause: {
		label: "Pause and investigate",
		description:
			"Resolve the recorded concern before collecting more evidence or opening additional intake.",
	},
	archive: {
		label: "Archive threshold reached",
		description:
			"The evidence window closed at or below the precommitted meaningful-signal ceiling.",
	},
};

export function PilotReadinessPanel({ pilotId }: { pilotId: string }) {
	const { user, isLoading: isAuthLoading } = useAuth();
	const readinessQuery = useQuery({
		queryKey: ["pilot-readiness-summary", pilotId, user?.id ?? "anonymous"],
		queryFn: () => getPilotReadinessSummary(pilotId),
		enabled: !isAuthLoading && Boolean(user),
		retry: false,
	});

	if (isAuthLoading || !user) {
		return null;
	}

	if (readinessQuery.isError) {
		return (
			<p
				className="mt-12 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive"
				role="alert"
			>
				Private readiness evidence is unavailable right now. Please try again
				later.
			</p>
		);
	}

	const readiness = readinessQuery.data;
	if (readinessQuery.isPending || !readiness) {
		return null;
	}

	const recommendation = recommendationCopy[readiness.recommendation];

	return (
		<section
			aria-label="Private readiness dashboard"
			className="mt-12 rounded-[2rem] border border-primary/25 bg-card/90 p-7 shadow-[0_28px_75px_-48px_oklch(0.32_0.08_43_/_0.6)] sm:p-10"
		>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
						<BarChart3 className="size-4" aria-hidden="true" />
						Private readiness dashboard
					</p>
					<h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
						Evidence against the published thresholds
					</h2>
					<p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
						Aggregate progress for the concept creator and trusted pilot
						operators. Member identities are never included.
					</p>
				</div>
				<ClipboardCheck
					className="size-9 shrink-0 text-primary"
					aria-hidden="true"
				/>
			</div>

			<dl className="mt-7 grid gap-3 sm:grid-cols-3">
				<Metric
					value={readiness.meaningfulSignalCount}
					label="meaningful signals"
				/>
				<Metric
					value={readiness.participantResponseCount}
					label="participant responses"
				/>
				<Metric
					value={readiness.projectResponseCount}
					label="suitable project signals"
				/>
			</dl>

			<div className="mt-4 grid gap-3 rounded-2xl border bg-background/70 p-5 text-sm sm:grid-cols-3">
				<p>
					<span className="font-semibold">
						{readiness.activeApplicationCount} active
					</span>
					<span className="mt-1 block text-muted-foreground">
						private applications
					</span>
				</p>
				<p>
					<span className="font-semibold">
						{readiness.acceptedApplicationCount} accepted
					</span>
					<span className="mt-1 block text-muted-foreground">
						authorized projects
					</span>
				</p>
				<p>
					<span className="font-semibold">
						{readiness.remainingCapacity} spaces remain
					</span>
					<span className="mt-1 block text-muted-foreground">
						within pilot capacity
					</span>
				</p>
			</div>

			<div className="mt-6 rounded-2xl border border-primary/20 bg-primary/7 p-5">
				<p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
					Threshold preview
				</p>
				<p className="mt-2 text-xl font-semibold">{recommendation.label}</p>
				<p className="mt-2 text-sm leading-6 text-muted-foreground">
					{recommendation.description}
				</p>
			</div>

			<p className="mt-6 flex items-start gap-2 border-t pt-4 text-xs leading-5 text-muted-foreground">
				<LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
				This preview applies precommitted rules to aggregate counts. It does not
				expose private responses or replace a documented human decision.
			</p>
		</section>
	);
}

function Metric({ value, label }: { value: number; label: string }) {
	return (
		<div className="rounded-2xl border bg-background/70 p-5">
			<dd className="text-3xl font-semibold tracking-tight text-primary">
				{value}
			</dd>
			<dt className="mt-1 text-sm font-medium text-muted-foreground">
				{label}
			</dt>
		</div>
	);
}
