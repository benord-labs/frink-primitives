import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./cn";

export const inputVariants = cva(
	[
		"w-full rounded-[var(--field-radius)] border border-field-border bg-field px-3 text-sm text-ink outline-none transition-[border-color,box-shadow]",
		"placeholder:text-muted-fg caret-primary",
		"focus:border-primary focus:ring-2 focus:ring-primary/25",
		"data-[error=true]:border-danger data-[error=true]:focus:ring-danger/25",
		"disabled:cursor-not-allowed disabled:opacity-50",
	],
	{
		variants: {
			// Height and vertical padding travel TOGETHER, and py-* lives ENTIRELY here
			// rather than in the base string. A caller's `h-8` cannot size this control on
			// its own: height and padding are different tailwind-merge groups, so a base
			// py-* would survive the merge and eat the shorter box (h-7 against py-2.5
			// leaves 8px for a 20px line). Keeping py-* in the variant also means a direct
			// inputVariants() caller gets exactly one py-* without tailwind-merge.
			// `default` resolves to themeable tokens, so a consumer re-scales every unsized
			// field with one token — the same contract as Button's --btn-radius-base.
			size: {
				default: "h-[var(--field-height-base)] py-[var(--field-pad-y-base)]",
				xs: "h-7 py-0",
				sm: "h-8 py-0",
				md: "h-9 py-0",
				lg: "h-11 py-0",
				auto: "h-auto py-2.5",
			},
		},
		defaultVariants: { size: "default" },
	},
);

export type InputSize = NonNullable<VariantProps<typeof inputVariants>["size"]>;

export interface InputProps
	// `size` is also a native <input> attribute (visible character width), so the
	// variant shadows it and the native one must be omitted for both to type-check.
	// Tailwind width utilities supersede the attribute anyway.
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
		VariantProps<typeof inputVariants> {
	error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ error, size, className, type, ...props },
	ref,
) {
	return (
		<input
			ref={ref}
			type={type}
			data-error={error || undefined}
			// Before the spread so an explicit caller value still wins.
			aria-invalid={error || undefined}
			className={cn(
				inputVariants({ size }),
				// Native chrome the design never draws. Keyed off `type` rather than a prop
				// so no call site has to remember to ask for it.
				type === "number" &&
					"[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
				type === "search" &&
					"[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
				className,
			)}
			{...props}
		/>
	);
});
