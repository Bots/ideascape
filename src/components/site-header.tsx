import { ArrowRight, MapPinned } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader({
	account,
	exploreLabel = "Explore ideas",
	exploreTo = "/ideas",
	showExplore = true,
	showStartIdea = true,
}: {
	account?: ReactNode;
	exploreLabel?: string;
	exploreTo?: string;
	showExplore?: boolean;
	showStartIdea?: boolean;
}) {
	return (
		<header className="border-b border-border bg-card/95">
			<div className="site-shell flex min-h-16 flex-wrap items-center gap-x-6 gap-y-3 py-2">
				<Link
					aria-label="Ideascape home"
					className="group flex min-h-11 items-center gap-3"
					to="/"
				>
					<span className="relative grid size-10 place-items-center border border-primary bg-primary text-primary-foreground transition group-hover:bg-primary/90">
						<MapPinned className="size-5" aria-hidden="true" />
						<span className="absolute -bottom-1 -right-1 size-2.5 border border-card bg-signal" />
					</span>
					<span className="grid leading-none">
						<span className="text-base font-semibold tracking-[-0.02em]">
							Ideascape
						</span>
						<span className="mt-1 hidden font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground md:block">
							Public idea fieldwork
						</span>
					</span>
				</Link>

				{showExplore || showStartIdea ? (
					<nav
						aria-label="Primary"
						className="order-3 flex w-full items-center gap-1 border-t border-border pt-2 sm:order-none sm:w-auto sm:border-0 sm:pt-0"
					>
						{showExplore ? (
							<Link
								className={cn(
									buttonVariants({ variant: "ghost", size: "sm" }),
									"px-3",
								)}
								to={exploreTo}
							>
								{exploreLabel}
							</Link>
						) : null}
						{showStartIdea ? (
							<Link
								className={cn(
									buttonVariants({ variant: "outline", size: "sm" }),
									"px-3",
								)}
								to="/ideas/new"
							>
								Start an idea
								<ArrowRight aria-hidden="true" />
							</Link>
						) : null}
					</nav>
				) : null}

				{account ? <div className="ml-auto min-w-0">{account}</div> : null}
			</div>
		</header>
	);
}
