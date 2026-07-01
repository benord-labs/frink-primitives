import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type FormMessageVariant = "error" | "success" | "info";

const TONE: Record<FormMessageVariant, string> = {
	error: "text-danger-fg",
	success: "text-success-fg",
	info: "text-muted",
};

export interface FormMessageProps extends HTMLAttributes<HTMLParagraphElement> {
	variant?: FormMessageVariant;
}

/** Inline validation / status message for forms and fields. */
export function FormMessage({
	variant = "error",
	className,
	...props
}: FormMessageProps) {
	return (
		<p
			role={variant === "error" ? "alert" : "status"}
			className={cn("text-xs leading-relaxed", TONE[variant], className)}
			{...props}
		/>
	);
}
