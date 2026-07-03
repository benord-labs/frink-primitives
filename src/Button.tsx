import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import {
	type AnchorHTMLAttributes,
	type ButtonHTMLAttributes,
	forwardRef,
} from "react";
import { cn } from "./cn";

export const buttonVariants = cva(
	"btn inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap font-medium leading-none tracking-[0.01em] outline-none transition-[filter,box-shadow,background-color,border-color] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
	{
		variants: {
			variant: {
				primary: "glow-rim-primary text-primary-fg",
				secondary: "glow-rim text-ink hover:bg-[var(--hover-overlay)]",
				ghost: "text-muted-fg hover:bg-[var(--hover-overlay)] hover:text-ink",
				destructive: "glow-rim-danger text-danger-fg hover:bg-danger/10",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				xs: "h-6 gap-1.5 px-2.5 text-xs",
				sm: "h-7 gap-1.5 px-3 text-[13px]",
				md: "h-8 gap-2 px-4 text-sm",
				lg: "h-10 gap-2 px-6 text-[15px]",
				xl: "h-12 gap-2.5 px-8 text-base",
				auto: "h-auto px-2 py-1.5",
				icon: "size-5 p-0",
			},
			iconOnly: { true: "aspect-square px-0", false: "" },
			// Corner geometry, orthogonal to variant/size. Radius lives ENTIRELY in this
			// variant (not the base string) so cva emits exactly ONE rounded-* class even
			// without tailwind-merge — a direct buttonVariants() caller never gets two
			// conflicting radii. `default` (the defaultVariants pick) resolves to the
			// themeable --btn-radius-base token, so a consumer flips its default button
			// shape with one token.
			shape: {
				default: "rounded-[var(--btn-radius-base)]",
				pill: "rounded-[var(--btn-radius-pill)]",
				md: "rounded-[var(--btn-radius-md)]",
				square: "rounded-[var(--btn-radius-square)]",
			},
		},
		defaultVariants: { variant: "primary", size: "md", shape: "default" },
	},
);

export type ButtonVariant = NonNullable<
	VariantProps<typeof buttonVariants>["variant"]
>;
export type ButtonSize = NonNullable<
	VariantProps<typeof buttonVariants>["size"]
>;
export type ButtonShape = NonNullable<
	VariantProps<typeof buttonVariants>["shape"]
>;

export interface ButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "href">,
		VariantProps<typeof buttonVariants> {
	/** Render as an anchor with this href instead of a <button>. */
	href?: string;
	target?: string;
	rel?: string;
	/** Shows a spinner and disables the control. */
	loading?: boolean;
	/** Merge styling onto the single child element (Radix Slot) instead of rendering a button. */
	asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button(
		{
			variant,
			size,
			iconOnly,
			shape,
			loading = false,
			asChild = false,
			href,
			target,
			rel,
			disabled,
			type = "button",
			className,
			children,
			...props
		},
		ref,
	) {
		const classes = cn(
			buttonVariants({ variant, size, iconOnly, shape }),
			className,
		);

		if (asChild) {
			// ponytail: loading spinner is non-asChild only (ticket keeps loading on
			// the button/anchor path). Slot needs one child = the caller's element.
			// `type` was destructured out above; merge it back so Slot forwards it onto the
			// caller's child (a slotted <button> otherwise loses the default). Slot's typing
			// omits `type`, so pass it through the spread rather than as an explicit prop.
			const childProps = { type, ...props };
			return (
				<Slot ref={ref} className={classes} {...childProps}>
					{children}
				</Slot>
			);
		}

		const inner = (
			<>
				{loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
				{children}
			</>
		);

		if (href !== undefined) {
			return (
				<a
					href={href}
					target={target}
					rel={rel}
					aria-disabled={disabled || loading || undefined}
					className={classes}
					{...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
				>
					{inner}
				</a>
			);
		}

		return (
			<button
				ref={ref}
				// Default to a non-submitting button so a Button in a <form> never submits by
				// accident. `type` is destructured out of props, so its default wins over an
				// `undefined` spread value, while an explicit caller type (e.g. "submit") still wins.
				type={type}
				disabled={disabled || loading}
				className={classes}
				{...props}
			>
				{inner}
			</button>
		);
	},
);
