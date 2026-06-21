import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "./cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	error?: boolean;
	wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	function Select(
		{ error, className, wrapperClassName, children, ...props },
		ref,
	) {
		return (
			<div className={cn("relative inline-flex w-full", wrapperClassName)}>
				<select
					ref={ref}
					data-error={error || undefined}
					className={cn(
						"w-full appearance-none rounded-[10px] border border-field-border bg-field py-2.5 pr-9 pl-3 text-sm text-ink outline-none transition-[border-color,box-shadow]",
						"focus:border-primary focus:ring-2 focus:ring-primary/25",
						"data-[error=true]:border-danger data-[error=true]:focus:ring-danger/25",
						"disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					{...props}
				>
					{children}
				</select>
				<ChevronDown
					className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
					aria-hidden
				/>
			</div>
		);
	},
);
