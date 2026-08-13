import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	ArrowRight,
	Check,
	ClipboardCheck,
	LockKeyhole,
	Trash2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import {
	getIdeaValidationQuestion,
	type IdeaValidationQuestion,
	removeIdeaValidationResponse,
	saveIdeaValidationResponse,
} from "@/features/ideas/idea-validation-service";
import { cn } from "@/lib/utils";

type ValidationAction =
	| { type: "select"; optionId: string }
	| { type: "remove" };

export function IdeaValidationPanel({ ideaId }: { ideaId: string }) {
	const { user, isLoading: isAuthLoading } = useAuth();
	const { pathname, search, hash } = useLocation();
	const queryClient = useQueryClient();
	const queryKey = [
		"idea-validation-question",
		ideaId,
		user?.id ?? "anonymous",
	] as const;
	const signInPath = `/sign-in?${new URLSearchParams({
		returnTo: `${pathname}${search}${hash}`,
	}).toString()}`;
	const questionQuery = useQuery({
		queryKey,
		queryFn: () => getIdeaValidationQuestion(ideaId),
		retry: false,
	});
	const responseMutation = useMutation({
		mutationFn: async (action: ValidationAction) => {
			if (!user || !questionQuery.data) {
				return;
			}

			if (action.type === "remove") {
				await removeIdeaValidationResponse(questionQuery.data.id, user.id);
				return;
			}

			await saveIdeaValidationResponse(
				questionQuery.data.id,
				action.optionId,
				user.id,
			);
		},
		onSuccess: (_, action) => {
			queryClient.setQueryData<IdeaValidationQuestion | null>(
				queryKey,
				(current) => {
					if (!current) {
						return current;
					}

					return {
						...current,
						viewerOptionId: action.type === "select" ? action.optionId : null,
					};
				},
			);
		},
	});

	if (questionQuery.isPending || isAuthLoading) {
		return null;
	}

	if (questionQuery.isError) {
		return (
			<p
				className="mt-12 border border-destructive/20 border-l-4 border-l-destructive bg-destructive/5 p-4 text-sm text-destructive"
				role="alert"
			>
				The bounty readiness question is unavailable right now. Try again later.
			</p>
		);
	}

	const question = questionQuery.data;
	if (!question) {
		return null;
	}

	return (
		<section
			aria-labelledby="pilot-question-heading"
			className="field-panel relative mt-12 overflow-hidden border-t-4 border-t-primary p-7 sm:p-10"
		>
			<div className="relative grid gap-7 lg:grid-cols-[minmax(0,0.82fr)_minmax(25rem,1.18fr)] lg:items-start">
				<div>
					<p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
						<ClipboardCheck className="size-4" aria-hidden="true" />
						Authorized test-run readiness
					</p>
					<h2
						className="mt-3 text-3xl font-light tracking-[-0.025em] sm:text-4xl"
						id="pilot-question-heading"
					>
						{question.prompt}
					</h2>
					<p className="mt-4 max-w-xl leading-7 text-muted-foreground">
						Choose the closest fit. This asks whether the bounty has clear rules
						of engagement, a reproducible proof threshold, and an authorized
						test environment.
					</p>
					<p className="mt-5 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
						<LockKeyhole
							className="mt-0.5 size-4 shrink-0 text-primary"
							aria-hidden="true"
						/>
						<span>
							Your choice stays private. The system owner sees aggregate totals
							only.
						</span>
					</p>
				</div>

				<div className="border border-border bg-background/70 p-4 sm:p-5">
					{user ? (
						<div>
							<fieldset>
								<legend className="text-sm font-semibold">
									Select one private answer
								</legend>
								<div className="mt-3 grid gap-2">
									{question.options.map((option) => {
										const isSelected = question.viewerOptionId === option.id;

										return (
											<button
												aria-pressed={isSelected}
												className={cn(
													"flex min-h-12 w-full items-center gap-3 rounded-sm border px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60",
													isSelected
														? "border-primary bg-primary text-primary-foreground"
														: "border-border bg-card text-foreground hover:border-primary/35 hover:bg-primary/5",
												)}
												disabled={responseMutation.isPending}
												key={option.id}
												onClick={() =>
													responseMutation.mutate({
														type: "select",
														optionId: option.id,
													})
												}
												type="button"
											>
												<span
													className={cn(
														"grid size-6 shrink-0 place-items-center rounded-full border",
														isSelected
															? "border-primary-foreground/45 bg-primary-foreground/15"
															: "border-muted-foreground/35",
													)}
												>
													{isSelected ? (
														<Check className="size-4" aria-hidden="true" />
													) : null}
												</span>
												{option.label}
											</button>
										);
									})}
								</div>
							</fieldset>

							{question.viewerOptionId ? (
								<div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
									<p
										className="text-sm font-semibold text-primary"
										role="status"
									>
										Answer saved privately
									</p>
									<Button
										className="justify-start text-muted-foreground sm:justify-center"
										disabled={responseMutation.isPending}
										onClick={() => responseMutation.mutate({ type: "remove" })}
										type="button"
										variant="ghost"
									>
										<Trash2 aria-hidden="true" />
										Remove my answer
									</Button>
								</div>
							) : null}
						</div>
					) : (
						<div>
							<p className="text-sm font-semibold">Possible answers</p>
							<ul className="mt-3 grid gap-2">
								{question.options.map((option) => (
									<li
										className="flex min-h-11 items-center gap-3 rounded-sm border bg-card px-4 py-2.5 text-sm font-medium"
										key={option.id}
									>
										<span
											className="size-2 rounded-full bg-primary"
											aria-hidden="true"
										/>
										{option.label}
									</li>
								))}
							</ul>
							<Link
								className={buttonVariants({ className: "mt-4 h-11 w-full" })}
								to={signInPath}
							>
								Sign in to answer privately
								<ArrowRight aria-hidden="true" />
							</Link>
						</div>
					)}

					{responseMutation.isError ? (
						<p className="mt-3 text-sm text-destructive" role="alert">
							We could not save your bounty answer. Try again.
						</p>
					) : null}
				</div>
			</div>
		</section>
	);
}
