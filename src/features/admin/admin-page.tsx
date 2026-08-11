import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Activity,
	ClipboardCheck,
	FileStack,
	HeartHandshake,
	LockKeyhole,
	ShieldCheck,
	type LucideIcon,
	Users,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import {
	getAdminDashboardSummary,
	getAdminIdeaActivity,
	type AdminDashboardSummary,
} from "@/features/admin/admin-service";
import { useAuth } from "@/features/auth/auth-provider";
import { cn } from "@/lib/utils";

export function AdminPage() {
	const { user, isLoading: isAuthLoading } = useAuth();
	const queryClient = useQueryClient();
	const userId = user?.id;
	const summaryQuery = useQuery({
		queryKey: ["admin-dashboard-summary", userId],
		queryFn: getAdminDashboardSummary,
		enabled: Boolean(user) && !isAuthLoading,
		gcTime: 0,
		refetchOnMount: "always",
		retry: false,
		staleTime: 0,
	});
	const activityQuery = useQuery({
		queryKey: ["admin-idea-activity", userId],
		queryFn: getAdminIdeaActivity,
		enabled: Boolean(user && summaryQuery.data),
		gcTime: 0,
		refetchOnMount: "always",
		retry: false,
		staleTime: 0,
	});

	useEffect(
		() => () => {
			queryClient.removeQueries({
				queryKey: ["admin-dashboard-summary", userId],
			});
			queryClient.removeQueries({
				queryKey: ["admin-idea-activity", userId],
			});
		},
		[queryClient, userId],
	);

	if (isAuthLoading) {
		return <AdminStatusPage message="Restoring your session…" />;
	}

	if (!user) {
		return (
			<AdminStatusPage
				heading="Sign in to view operations"
				message="The operations dashboard is restricted to authorized Ideascape administrators."
				action={
					<Link className={buttonVariants()} to="/sign-in?returnTo=%2Fadmin">
						Sign in
					</Link>
				}
			/>
		);
	}

	if (summaryQuery.isPending) {
		return <AdminStatusPage message="Loading operations dashboard…" />;
	}

	if (summaryQuery.isError) {
		return (
			<AdminStatusPage
				message="Unable to load the operations dashboard. Please try again later."
				isError
			/>
		);
	}

	if (!summaryQuery.data) {
		return (
			<AdminStatusPage
				heading="Admin access required"
				message="Your account is signed in, but it is not authorized to view private operational aggregates."
			/>
		);
	}

	return (
		<AdminDashboard
			summary={summaryQuery.data}
			activity={activityQuery.data ?? []}
			isActivityLoading={activityQuery.isPending}
			isActivityError={activityQuery.isError}
		/>
	);
}

function AdminDashboard({
	summary,
	activity,
	isActivityLoading,
	isActivityError,
}: {
	summary: AdminDashboardSummary;
	activity: Awaited<ReturnType<typeof getAdminIdeaActivity>>;
	isActivityLoading: boolean;
	isActivityError: boolean;
}) {
	const generatedAt = new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(summary.generatedAt));
	const otherIdeaCount = Math.max(
		0,
		summary.ideaCount - summary.publishedIdeaCount - summary.draftIdeaCount,
	);

	return (
		<>
			<SiteHeader exploreLabel="Concept catalog" />
			<main className="min-h-screen overflow-hidden bg-background text-foreground">
				<div className="site-shell">
					<section className="border-x border-b border-border bg-background/94 px-6 pb-12 pt-12 sm:px-10 sm:pb-16 sm:pt-16 lg:px-12 lg:pt-20">
						<div className="max-w-4xl">
							<p className="signal-label inline-flex items-center gap-2 border-l-2 border-signal pl-3">
								<Activity className="size-4" aria-hidden="true" />
								Private operations
							</p>
							<h1 className="mt-6 text-balance text-5xl font-light leading-[1] tracking-[-0.035em] sm:text-7xl">
								Operations dashboard
							</h1>
							<p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
								A privacy-preserving view of IdeaScape activity, validation, and
								pilot readiness. Counts are live at request time.
							</p>
							<p className="mt-4 text-sm text-muted-foreground">
								Generated{" "}
								<time dateTime={summary.generatedAt}>{generatedAt}</time>
							</p>
						</div>
					</section>

					<section
						aria-label="Operational overview"
						className="grid gap-px border border-border bg-border sm:grid-cols-2 xl:grid-cols-3"
					>
						<MetricCard
							icon={Users}
							value={summary.memberCount}
							label="Members"
							detail="Public member profiles"
						/>
						<MetricCard
							icon={FileStack}
							value={summary.ideaCount}
							label="Ideas"
							detail={`${summary.publishedIdeaCount} published · ${summary.draftIdeaCount} private drafts · ${otherIdeaCount} other states`}
						/>
						<MetricCard
							icon={HeartHandshake}
							value={summary.interestSignalCount}
							label="Interest signals"
							detail={`${summary.meaningfulSignalCount} include practical participation intent`}
						/>
						<MetricCard
							icon={ClipboardCheck}
							value={summary.validationResponseCount}
							label="Validation responses"
							detail="Private answers counted in aggregate"
						/>
						<MetricCard
							icon={Activity}
							value={summary.openApplicationCount}
							label="Open pilot applications"
							detail={`${summary.acceptedApplicationCount} accepted · ${summary.pilotCount} pilot plans`}
						/>
						<MetricCard
							icon={ShieldCheck}
							value={summary.pilotCount}
							label="Pilots"
							detail="Published threshold-based plans"
						/>
					</section>

					<section className="field-panel mt-10 border-t-4 border-t-primary p-6 sm:p-8">
						<div className="flex flex-wrap items-end justify-between gap-4">
							<div>
								<p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
									Published concepts only
								</p>
								<h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
									Idea activity
								</h2>
							</div>
							<p className="max-w-xl text-sm leading-6 text-muted-foreground">
								Sorted by combined interest, validation responses, and pilot
								applications.
							</p>
						</div>

						{isActivityLoading ? (
							<p className="mt-8 text-sm text-muted-foreground" role="status">
								Loading concept activity…
							</p>
						) : null}
						{isActivityError ? (
							<p className="mt-8 text-sm text-destructive" role="alert">
								Unable to load concept activity. The dashboard summary is still
								available.
							</p>
						) : null}
						{!isActivityLoading && !isActivityError && activity.length === 0 ? (
							<p className="mt-8 border border-dashed p-6 text-sm text-muted-foreground">
								No published concept activity yet.
							</p>
						) : null}
						{activity.length > 0 ? (
							<div className="mt-7 overflow-x-auto">
								<table className="w-full min-w-[680px] border-separate border-spacing-0 text-left text-sm">
									<thead>
										<tr className="text-xs uppercase tracking-wider text-muted-foreground">
											<th className="border-b px-3 py-3 font-semibold">
												Concept
											</th>
											<th className="border-b px-3 py-3 text-right font-semibold">
												Interest
											</th>
											<th className="border-b px-3 py-3 text-right font-semibold">
												Validation
											</th>
											<th className="border-b px-3 py-3 text-right font-semibold">
												Applications
											</th>
										</tr>
									</thead>
									<tbody>
										{activity.map((idea) => (
											<tr key={idea.ideaId}>
												<td className="border-b px-3 py-4">
													<Link
														className="font-semibold text-primary underline-offset-4 hover:underline"
														to={`/ideas/${idea.slug}`}
													>
														{idea.title}
													</Link>
													<p className="mt-1 text-xs text-muted-foreground">
														{idea.categoryName ?? "Uncategorized"}
													</p>
												</td>
												<td className="border-b px-3 py-4 text-right tabular-nums">
													{idea.interestSignalCount}
												</td>
												<td className="border-b px-3 py-4 text-right tabular-nums">
													{idea.validationResponseCount}
												</td>
												<td className="border-b px-3 py-4 text-right tabular-nums">
													{idea.pilotApplicationCount}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : null}
					</section>

					<aside className="my-10 flex gap-4 border border-primary/25 border-l-4 border-l-primary bg-primary/8 p-5 text-sm leading-6 text-muted-foreground">
						<LockKeyhole
							className="mt-0.5 size-5 shrink-0 text-primary"
							aria-hidden="true"
						/>
						<div>
							<p className="font-semibold text-foreground">Privacy boundary</p>
							<p className="mt-1">
								Respondent identities are excluded, draft content is excluded,
								and pilot application details are excluded. This dashboard
								exposes operational aggregates, not individual histories.
							</p>
						</div>
					</aside>
				</div>
			</main>
		</>
	);
}

function MetricCard({
	icon: Icon,
	value,
	label,
	detail,
}: {
	icon: LucideIcon;
	value: number;
	label: string;
	detail: string;
}) {
	return (
		<article className="bg-card p-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-4xl font-semibold tracking-tight tabular-nums">
						{value}
					</p>
					<h2 className="mt-2 font-semibold">{label}</h2>
				</div>
				<span className="grid size-10 place-items-center border border-primary/30 text-primary">
					<Icon className="size-5" aria-hidden="true" />
				</span>
			</div>
			<p className="mt-4 text-sm leading-6 text-muted-foreground">{detail}</p>
		</article>
	);
}

function AdminStatusPage({
	heading = "Ideascape operations",
	message,
	isError = false,
	action,
}: {
	heading?: string;
	message: string;
	isError?: boolean;
	action?: React.ReactNode;
}) {
	return (
		<main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
			<section className="field-panel w-full max-w-xl border-t-4 border-t-primary p-8 text-center sm:p-12">
				<span className="mx-auto grid size-12 place-items-center border border-primary/30 text-primary">
					<ShieldCheck className="size-6" aria-hidden="true" />
				</span>
				<h1 className="mt-6 text-3xl font-semibold tracking-tight">
					{heading}
				</h1>
				<p
					className={cn(
						"mt-4 leading-7 text-muted-foreground",
						isError && "text-destructive",
					)}
					role={
						isError ? "alert" : message.endsWith("…") ? "status" : undefined
					}
				>
					{message}
				</p>
				{action ? <div className="mt-7">{action}</div> : null}
				<Link
					className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
					to="/"
				>
					Return home
				</Link>
			</section>
		</main>
	);
}
