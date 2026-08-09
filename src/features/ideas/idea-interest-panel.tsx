import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Heart, LoaderCircle, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import {
	getIdeaInterestSummary,
	removeIdeaInterest,
	signalIdeaInterest,
	type IdeaInterestSummary,
} from "@/features/ideas/idea-interest-service";

export function IdeaInterestPanel({ ideaId }: { ideaId: string }) {
	const { user, isLoading: isAuthLoading } = useAuth();
	const queryClient = useQueryClient();
	const queryKey = ["idea-interest", ideaId, user?.id ?? "anonymous"] as const;
	const summaryQuery = useQuery({
		queryKey,
		queryFn: () => getIdeaInterestSummary(ideaId),
		retry: false,
	});
	const interestMutation = useMutation({
		mutationFn: async () => {
			if (!user || !summaryQuery.data) {
				return;
			}

			if (summaryQuery.data.viewerHasInterest) {
				await removeIdeaInterest(ideaId, user.id);
				return;
			}

			await signalIdeaInterest(ideaId, user.id);
		},
		onSuccess: () => {
			queryClient.setQueryData<IdeaInterestSummary>(queryKey, (current) => {
				if (!current || !user) {
					return current;
				}

				const nextViewerState = !current.viewerHasInterest;
				return {
					interestCount: Math.max(
						0,
						current.interestCount + (nextViewerState ? 1 : -1),
					),
					viewerHasInterest: nextViewerState,
				};
			});
		},
	});

	const summary = summaryQuery.data;
	const isPending = isAuthLoading || summaryQuery.isPending;
	const countLabel = summary
		? `${summary.interestCount} ${summary.interestCount === 1 ? "person is" : "people are"} interested`
		: "";

	return (
		<section
			aria-labelledby="idea-interest-heading"
			className="relative mt-12 overflow-hidden rounded-3xl border border-foreground/15 bg-foreground p-7 text-background shadow-[0_28px_75px_-35px_oklch(0.22_0.05_43_/_0.75)] sm:p-9"
		>
			<div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-primary/35 blur-3xl" />
			<div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
				<div>
					<p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
						<UsersRound className="size-4" aria-hidden="true" />
						Help shape what comes next
					</p>
					<h2
						className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
						id="idea-interest-heading"
					>
						Would you want to see this happen?
					</h2>
					<p className="mt-3 max-w-2xl leading-7 text-background/70">
						Signal your interest to help us learn which concepts resonate. No
						payment or commitment—this only helps us understand demand.
					</p>
				</div>

				<div className="relative min-w-52 rounded-2xl border border-background/15 bg-background/8 p-4 backdrop-blur-sm">
					{isPending ? (
						<p
							className="flex items-center gap-2 text-sm text-background/70"
							role="status"
						>
							<LoaderCircle
								className="size-4 animate-spin"
								aria-hidden="true"
							/>
							Loading interest…
						</p>
					) : null}

					{summaryQuery.isError ? (
						<p className="text-sm text-background/80" role="alert">
							Interest signals are unavailable right now. Please try again
							later.
						</p>
					) : null}

					{summary ? (
						<>
							<p
								className="mb-3 text-sm font-semibold text-background/75"
								aria-live="polite"
							>
								{countLabel}
							</p>
							{user ? (
								<Button
									aria-pressed={summary.viewerHasInterest}
									className="w-full shadow-[0_12px_28px_-14px_oklch(0.67_0.2_39)]"
									disabled={interestMutation.isPending}
									onClick={() => interestMutation.mutate()}
									type="button"
								>
									<Heart
										className={
											summary.viewerHasInterest ? "fill-current" : undefined
										}
										aria-hidden="true"
									/>
									{summary.viewerHasInterest
										? "Remove interest"
										: "I'm interested"}
								</Button>
							) : (
								<Link
									className={buttonVariants({ className: "w-full" })}
									to="/sign-in"
								>
									Sign in to show interest
									<ArrowRight aria-hidden="true" />
								</Link>
							)}
						</>
					) : null}

					{interestMutation.isError ? (
						<p className="mt-3 text-sm text-background/80" role="alert">
							We could not update your interest. Please try again.
						</p>
					) : null}
				</div>
			</div>
		</section>
	);
}
