import { useQuery } from "@tanstack/react-query";
import { BarChart3, LockKeyhole } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { getIdeaValidationSummary } from "@/features/ideas/idea-validation-service";

export function IdeaValidationEvidencePanel({
	ideaId,
	creatorId,
}: {
	ideaId: string;
	creatorId: string;
}) {
	const { user, isLoading: isAuthLoading } = useAuth();
	const isCreator = user?.id === creatorId;
	const evidenceQuery = useQuery({
		queryKey: ["idea-validation-summary", ideaId, user?.id ?? "anonymous"],
		queryFn: () => getIdeaValidationSummary(ideaId),
		enabled: isCreator,
		retry: false,
	});

	if (isAuthLoading || !isCreator) {
		return null;
	}

	if (evidenceQuery.isError) {
		return (
			<p
				className="mt-8 border border-destructive/20 border-l-4 border-l-destructive bg-destructive/5 p-4 text-sm text-destructive"
				role="alert"
			>
				Private pilot evidence is unavailable right now. Please try again later.
			</p>
		);
	}

	const evidence = evidenceQuery.data;
	if (evidenceQuery.isPending || !evidence) {
		return null;
	}

	const maxCount = Math.max(
		1,
		...evidence.options.map((option) => option.responseCount),
	);

	return (
		<section
			aria-label="Private pilot evidence"
			className="field-panel mt-8 border-l-4 border-l-primary p-6 sm:p-8"
		>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
						<BarChart3 className="size-4" aria-hidden="true" />
						Private pilot evidence
					</p>
					<h2 className="mt-2 text-2xl font-semibold tracking-tight">
						Creator response summary
					</h2>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
						Aggregate evidence for “{evidence.prompt}” Member identities are
						never included.
					</p>
				</div>
				<div className="border border-border bg-background px-4 py-3 font-mono text-sm font-semibold">
					{evidence.totalResponses} total responses
				</div>
			</div>

			{evidence.totalResponses === 0 ? (
				<p className="mt-6 border border-dashed p-5 text-sm text-muted-foreground">
					No pilot responses yet. Keep the question open until there is enough
					evidence for a continue, revise, or pause decision.
				</p>
			) : (
				<div className="mt-6 grid gap-4">
					{evidence.options.map((option) => (
						<div key={option.id}>
							<div className="flex items-center justify-between gap-4 text-sm">
								<span className="font-medium">{option.label}</span>
								<span className="shrink-0 text-muted-foreground">
									{option.responseCount}{" "}
									{option.responseCount === 1 ? "response" : "responses"}
								</span>
							</div>
							<div
								aria-hidden="true"
								className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
							>
								<div
									className="h-full rounded-full bg-primary"
									style={{
										width: `${Math.max(4, (option.responseCount / maxCount) * 100)}%`,
									}}
								/>
							</div>
						</div>
					))}
				</div>
			)}

			<p className="mt-6 flex items-start gap-2 border-t pt-4 text-xs leading-5 text-muted-foreground">
				<LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
				Only aggregate option counts are displayed. Raw member responses remain
				protected by row-level security.
			</p>
		</section>
	);
}
