import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type AlertVariant = "info" | "success" | "error" | "warning";

const TONE: Record<AlertVariant, string> = {
	info: "border-field-border bg-elevated text-ink",
	success:
		"border-secondary/30 bg-secondary/5 text-secondary-800 dark:text-secondary-200",
	error: "border-danger/30 bg-danger/5 text-danger-800 dark:text-danger",
	warning: "border-warning/30 bg-warning/5 text-warning-800 dark:text-warning",
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
	variant?: AlertVariant;
}

/** Callout box for prominent notices (token errors, confirmations). Inline field
 * messages use FormMessage instead. */
export function Alert({ variant = "info", className, ...props }: AlertProps) {
	return (
		<div
			role={variant === "error" ? "alert" : "status"}
			className={cn(
				"rounded-xl border px-3.5 py-2.5 text-sm",
				TONE[variant],
				className,
			)}
			{...props}
		/>
	);
}
