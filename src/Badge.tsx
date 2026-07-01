import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

const badge = cva(
	"inline-flex items-center gap-1.5 rounded-full border bg-surface px-2.5 py-0.5 text-xs font-medium",
	{
		variants: {
			variant: {
				default: "border-rim text-ink",
				online: "border-rim text-ink",
				running: "border-field-border text-ink",
				success: "border-secondary/40 text-success-fg",
				warning: "border-warning/40 text-warning-fg",
				error: "border-danger/40 text-danger-fg",
			},
			// Geometry/chrome, orthogonal to colour. `tag`/`count` drop the border and
			// leading dot so a consumer `className` (now tailwind-merged) can fully
			// re-colour and re-size them — brand fills, accent tints, square digits.
			shape: {
				pill: "",
				tag: "rounded-md border-0 px-1.5 py-0",
				count:
					"min-w-4 justify-center rounded-full border-0 px-1 py-0 tabular-nums",
			},
		},
		defaultVariants: { variant: "default", shape: "pill" },
	},
);

// Interactive chips (links/buttons) rest muted and lift to ink on hover.
const INTERACTIVE =
	"cursor-pointer text-muted-fg transition-colors hover:border-hairline-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const DOT: Record<
	NonNullable<VariantProps<typeof badge>["variant"]>,
	string
> = {
	default: "bg-muted",
	online: "bg-online",
	running: "bg-ink",
	success: "bg-secondary",
	warning: "bg-warning",
	error: "bg-danger",
};

export type BadgeVariant = NonNullable<VariantProps<typeof badge>["variant"]>;
export type BadgeShape = NonNullable<VariantProps<typeof badge>["shape"]>;

export interface BadgeProps
	extends Omit<HTMLAttributes<HTMLElement>, "children">,
		VariantProps<typeof badge> {
	/** Hide the leading status dot. */
	noDot?: boolean;
	/** Pulse the leading dot (live status). */
	pulse?: boolean;
	/** Render as a link, turning the badge into an interactive chip. */
	href?: string;
	target?: string;
	rel?: string;
	/** Force the interactive chip treatment (auto-on when `href` is set). */
	interactive?: boolean;
	children?: ReactNode;
}

export function Badge({
	variant = "default",
	shape = "pill",
	noDot = false,
	pulse = false,
	href,
	interactive,
	className,
	children,
	...props
}: BadgeProps) {
	const isInteractive = interactive ?? href != null;
	const classes = cn(
		badge({ variant, shape }),
		isInteractive && INTERACTIVE,
		className,
	);
	const dotColor = DOT[variant ?? "default"];
	// Only the pill shape carries a leading status dot; tag/count are dotless.
	const showDot = !noDot && shape === "pill";

	const dot = !showDot ? null : pulse ? (
		<span className="relative flex size-1.5" aria-hidden>
			<span
				className={cn(
					"absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
					dotColor,
				)}
			/>
			<span
				className={cn("relative inline-flex size-1.5 rounded-full", dotColor)}
			/>
		</span>
	) : (
		<span className={cn("size-1.5 rounded-full", dotColor)} aria-hidden />
	);

	if (href != null) {
		return (
			<a
				href={href}
				className={classes}
				{...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
			>
				{dot}
				{children}
			</a>
		);
	}

	return (
		<span className={classes} {...props}>
			{dot}
			{children}
		</span>
	);
}
