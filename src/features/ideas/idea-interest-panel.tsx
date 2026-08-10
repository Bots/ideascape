import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Heart, LoaderCircle, UsersRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import {
	getIdeaInterestSummary,
	removeIdeaInterest,
	signalIdeaInterest,
	type IdeaInterestSummary,
	type ParticipationIntent,
} from "@/features/ideas/idea-interest-service";
import { cn } from "@/lib/utils";

const intentOptions: ReadonlyArray<{
	value: ParticipationIntent;
	label: string;
}> = [
	{ value: "use", label: "I would use this" },
	{ value: "build", label: "I would help build it" },
	{ value: "pilot", label: "I could test a pilot" },
	{ value: "expertise", label: "I have relevant expertise" },
	{ value: "updates", label: "Keep me updated" },
];

type InterestAction =
	| { type: "set-intent"; intent: ParticipationIntent }
	| { type: "remove" };

export function IdeaInterestPanel({ ideaId }: { ideaId: string }) {
	const { user, isLoading: isAuthLoading } = useAuth();
	const { pathname, search, hash } = useLocation();
	const queryClient = useQueryClient();
	const signInPath = `/sign-in?${new URLSearchParams({
		returnTo: `${pathname}${search}${hash}`,
	}).toString()}`;
	const queryKey = ["idea-interest", ideaId, user?.id ?? "anonymous"] as const;
	const summaryQuery = useQuery({
		queryKey,
		queryFn: () => getIdeaInterestSummary(ideaId),
		retry: false,
	});
	const interestMutation = useMutation({
		mutationFn: async (action: InterestAction) => {
			if (!user || !summaryQuery.data) {
				return;
			}

			if (action.type === "remove") {
				await removeIdeaInterest(ideaId, user.id);
				return;
			}

			await signalIdeaInterest(ideaId, user.id, action.intent);
		},
		onSuccess: (_, action) => {
			queryClient.setQueryData<IdeaInterestSummary>(queryKey, (current) => {
				if (!current || !user) {
					return current;
				}

				if (action.type === "remove") {
					return {
						interestCount: Math.max(
							0,
							current.interestCount - (current.viewerHasInterest ? 1 : 0),
						),
						viewerHasInterest: false,
						viewerIntent: null,
					};
				}

				return {
					interestCount:
						current.interestCount + (current.viewerHasInterest ? 0 : 1),
					viewerHasInterest: true,
					viewerIntent: action.intent,
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
			className="relative mt-12 overflow-hidden border border-neutral-500 border-t-4 border-t-signal bg-black p-7 text-white sm:p-9"
		>
			<div className="relative grid gap-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(26rem,1.15fr)] lg:items-center">
				<div>
					<p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-signal">
						<UsersRound className="size-4" aria-hidden="true" />
						Help shape what comes next
					</p>
					<h2
						className="mt-3 text-3xl font-light tracking-[-0.025em] sm:text-4xl"
						id="idea-interest-heading"
					>
						Would you want to see this happen?
					</h2>
					<p className="mt-3 max-w-2xl leading-7 text-neutral-300">
						Tell us how you might participate so we can distinguish curiosity
						from practical demand. No payment or commitment.
					</p>
				</div>

				<div className="relative border border-white/15 bg-white/8 p-4 sm:p-5">
					{isPending ? (
						<p
							className="flex items-center gap-2 text-sm text-neutral-300"
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
						<p className="text-sm text-neutral-200" role="alert">
							Interest signals are unavailable right now. Please try again
							later.
						</p>
					) : null}

					{summary ? (
						<>
							<p
								className="mb-3 text-sm font-semibold text-neutral-200"
								aria-live="polite"
							>
								{countLabel}
							</p>
							{user ? (
								<div>
									<fieldset>
										<legend className="text-sm font-semibold text-white">
											How would you participate?
										</legend>
										<p className="mt-1 text-xs leading-5 text-neutral-400">
											Your choice is private. Only the total interest count is
											public.
										</p>
										<div className="mt-3 grid gap-2 sm:grid-cols-2">
											{intentOptions.map((option) => {
												const isSelected =
													summary.viewerIntent === option.value;

												return (
													<button
														aria-pressed={isSelected}
														className={cn(
															"inline-flex min-h-11 items-center gap-2 rounded-sm border px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:pointer-events-none disabled:opacity-60",
															isSelected
																? "border-signal bg-signal text-black"
																: "border-neutral-500 bg-white/5 text-white hover:border-white/40 hover:bg-white/10",
														)}
														disabled={interestMutation.isPending}
														key={option.value}
														onClick={() =>
															interestMutation.mutate({
																type: "set-intent",
																intent: option.value,
															})
														}
														type="button"
													>
														<Heart
															className={cn(
																"size-4",
																isSelected && "fill-current",
															)}
															aria-hidden="true"
														/>
														{option.label}
													</button>
												);
											})}
										</div>
									</fieldset>

									{summary.viewerHasInterest ? (
										<Button
											aria-pressed="true"
											className="mt-3 w-full border-neutral-500 bg-transparent text-white hover:bg-white/10 hover:text-white"
											disabled={interestMutation.isPending}
											onClick={() =>
												interestMutation.mutate({ type: "remove" })
											}
											type="button"
											variant="outline"
										>
											Remove interest
										</Button>
									) : null}
								</div>
							) : (
								<Link
									className={buttonVariants({
										className:
											"w-full bg-white text-black hover:bg-neutral-200",
									})}
									to={signInPath}
								>
									Sign in to show interest
									<ArrowRight aria-hidden="true" />
								</Link>
							)}
						</>
					) : null}

					{interestMutation.isError ? (
						<p className="mt-3 text-sm text-neutral-200" role="alert">
							We could not update your interest. Please try again.
						</p>
					) : null}
				</div>
			</div>
		</section>
	);
}
