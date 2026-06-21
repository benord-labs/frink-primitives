import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ error, className, ...props },
	ref,
) {
	return (
		<input
			ref={ref}
			data-error={error || undefined}
			className={cn(
				"w-full rounded-[10px] border border-field-border bg-field px-3 py-2.5 text-sm text-ink outline-none transition-[border-color,box-shadow]",
				"placeholder:text-muted caret-primary",
				"focus:border-primary focus:ring-2 focus:ring-primary/25",
				"data-[error=true]:border-danger data-[error=true]:focus:ring-danger/25",
				"disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
});
