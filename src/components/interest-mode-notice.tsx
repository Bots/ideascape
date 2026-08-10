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
				"relative overflow-hidden border border-primary/30 border-l-4 border-l-primary bg-primary/6 p-4 sm:p-5",
				className,
			)}
			role="note"
		>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-start gap-3">
					<span className="grid size-10 shrink-0 place-items-center border border-primary/35 text-primary">
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
							className: "shrink-0 bg-card px-4",
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
