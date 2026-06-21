import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface SeparatorProps extends HTMLAttributes<HTMLElement> {
	orientation?: "horizontal" | "vertical";
	/** Optional centered label, e.g. "or continue with email". */
	label?: ReactNode;
}

export function Separator({
	orientation = "horizontal",
	label,
	className,
	...props
}: SeparatorProps) {
	if (label) {
		return (
			<div
				className={cn("flex items-center gap-3 text-xs text-muted", className)}
				{...props}
			>
				<span className="h-px flex-1 bg-hairline" aria-hidden />
				<span>{label}</span>
				<span className="h-px flex-1 bg-hairline" aria-hidden />
			</div>
		);
	}
	if (orientation === "vertical") {
		return (
			<div
				aria-hidden
				className={cn("w-px self-stretch bg-hairline", className)}
				{...props}
			/>
		);
	}
	return (
		<hr
			className={cn("h-px w-full border-0 bg-hairline", className)}
			{...props}
		/>
	);
}
