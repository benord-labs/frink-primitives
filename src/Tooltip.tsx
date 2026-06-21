import type { ReactNode } from "react";
import { cn } from "./cn";

export type TooltipProps = {
	/** Tooltip text shown on hover / focus. */
	label: ReactNode;
	/** The trigger (e.g. an icon Button). */
	children: ReactNode;
	side?: "top" | "bottom";
	className?: string;
};

/** Lightweight CSS tooltip: reveals on hover + keyboard focus of the trigger.
 * Supplementary only - the trigger must carry its own accessible name (aria-label). */
export function Tooltip({
	label,
	children,
	side = "top",
	className,
}: TooltipProps) {
	return (
		<span className={cn("group relative inline-flex", className)}>
			{children}
			<span
				role="tooltip"
				className={cn(
					"pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-field-border bg-elevated px-2.5 py-1 text-[11px] font-medium text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
					side === "top" ? "bottom-full mb-2" : "top-full mt-2",
				)}
			>
				{label}
			</span>
		</span>
	);
}
