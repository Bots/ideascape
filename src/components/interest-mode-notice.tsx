import { ArrowRight, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InterestModeNoticeProps = {
	className?: string;
	showAction?: boolean;
};

export function InterestModeNotice({
	className,
	showAction = false,
}: InterestModeNoticeProps) {
	return (
		<div
			aria-label="Exploration mode"
			className={cn(
				"relative overflow-hidden rounded-2xl border border-primary/25 bg-[linear-gradient(115deg,oklch(0.97_0.045_70),oklch(0.99_0.012_78))] p-4 shadow-[0_18px_45px_-35px_oklch(0.49_0.14_39_/_0.5)] sm:p-5",
				className,
			)}
			role="note"
		>
			<div className="absolute inset-y-0 left-0 w-1 bg-primary" />
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-start gap-3">
					<span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
						<FlaskConical className="size-5" aria-hidden="true" />
					</span>
					<div>
						<p className="font-semibold tracking-tight">Exploration mode</p>
						<p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
							These are concept previews, not active fundraisers. We&apos;re
							testing whether people want a place like this before opening
							funding.
						</p>
					</div>
				</div>
				{showAction ? (
					<Link
						className={buttonVariants({
							variant: "outline",
							className:
								"h-10 shrink-0 bg-card/80 px-4 shadow-sm hover:-translate-y-0.5",
						})}
						to="/sign-up"
					>
						Join the experiment
						<ArrowRight aria-hidden="true" />
					</Link>
				) : null}
			</div>
		</div>
	);
}
