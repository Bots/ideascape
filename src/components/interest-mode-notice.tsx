import { ArrowRight, FileCheck2 } from "lucide-react";
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
			aria-label="Authorized bounty rules"
			className={cn(
				"relative overflow-hidden border border-primary/30 border-l-4 border-l-primary bg-primary/6 p-4 sm:p-5",
				className,
			)}
			role="note"
		>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-start gap-3">
					<span className="grid size-10 shrink-0 place-items-center border border-primary/35 text-primary">
						<FileCheck2 className="size-5" aria-hidden="true" />
					</span>
					<div>
						<p className="font-semibold tracking-tight">Rules of engagement</p>
						<p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
							These are authorized security bounties, not invitations to probe
							random systems. Test only assets you own or have written
							permission to test. IdeaScape does not handle payouts, grant
							production access, or transfer operational authority. No
							authorization, no test.
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
						Create an account
						<ArrowRight aria-hidden="true" />
					</Link>
				) : null}
			</div>
		</div>
	);
}
