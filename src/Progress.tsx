import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export const progressVariants = cva(
	"track-recess relative w-full overflow-hidden rounded-[var(--track-radius)] bg-elevated",
	{
		variants: {
			// `default` resolves to a themeable token, so a consumer re-scales every
			// unsized track with one flip — the same contract as Button's
			// --btn-radius-base and Input's --field-height-base.
			size: {
				default: "h-[var(--track-height-base)]",
				xs: "h-1",
				sm: "h-1.5",
				md: "h-2",
				lg: "h-3",
			},
		},
		defaultVariants: { size: "default" },
	},
);

// ONE map drives both a segment's stripe and its legend dot, so the swatch and the bar
// can never disagree about what colour a state is. Every entry is a theme token — a raw
// hex here would be a frink/no-raw-color violation in any consumer.
const TONE = {
	primary: "bg-primary",
	"primary-soft": "bg-primary-200",
	success: "bg-secondary",
	warning: "bg-warning",
	danger: "bg-danger",
	info: "bg-info",
	online: "bg-online",
	muted: "bg-rim",
} as const;

export type ProgressTone = keyof typeof TONE;
export type ProgressSize = NonNullable<
	VariantProps<typeof progressVariants>["size"]
>;

export type ProgressSegment = {
	/** Stable key, and the legend label when `label` is omitted. */
	key: string;
	/** Legend label. Defaults to `key`. */
	label?: ReactNode;
	/** Raw count this segment contributes; widths are `value / total`. */
	value: number;
	tone?: ProgressTone;
	/** Escape hatch for a token colour outside the tone set. Applies to BOTH the
	 *  stripe and the legend dot, so they stay in step. */
	className?: string;
};

export interface ProgressProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
		VariantProps<typeof progressVariants> {
	/** Determinate progress, 0…`max`. Clamped. */
	value?: number;
	/** Determinate scale. Defaults to 100. */
	max?: number;
	/** Distribution mode: one stripe per state, sized by its share of the total. */
	segments?: ProgressSegment[];
	/** Unknown progress — a sweeping sliver, no `aria-valuenow`. */
	indeterminate?: boolean;
	/** Segmented mode: render the dot / label / count legend under the track. */
	legend?: boolean;
	/** Fill colour for the value + indeterminate modes. */
	tone?: ProgressTone;
	/** Lands on the track in EVERY mode (in value/indeterminate the track is the root). */
	trackClassName?: string;
	legendClassName?: string;
}

/** A count that can size a bar: negatives, NaN and Infinity all collapse to 0. */
const amount = (n: number): number => (Number.isFinite(n) && n > 0 ? n : 0);

/**
 * Progress / distribution track. Three modes, in precedence order:
 * `segments` (a queue split across states) → `indeterminate` → `value`.
 */
export function Progress({
	value = 0,
	max = 100,
	segments,
	indeterminate = false,
	legend = false,
	tone = "primary",
	size,
	className,
	trackClassName,
	legendClassName,
	...props
}: ProgressProps) {
	const track = cn(progressVariants({ size }), trackClassName);

	if (segments != null && segments.length > 0) {
		const parts = segments.map((s) => ({ ...s, amount: amount(s.value) }));
		const total = parts.reduce((sum, s) => sum + s.amount, 0);
		// Guard the divide: an all-zero queue is a real state (nothing running yet), and
		// `0/0` would otherwise put `width: NaN%` on every stripe.
		const width = (n: number) => (total > 0 ? `${(n / total) * 100}%` : "0%");
		const swatch = (s: (typeof parts)[number]) =>
			s.className ?? TONE[s.tone ?? "primary"];
		// An unnamed group node adds nothing, so only take the role once there's a name.
		const named =
			props["aria-label"] != null || props["aria-labelledby"] != null;

		return (
			<div
				className={cn("flex flex-col gap-2", className)}
				{...(named ? { role: "group" } : {})}
				{...props}
			>
				{/* The stripes are decorative: the legend (or the sr-only summary below)
				    is what carries the numbers to a screen reader. */}
				<div className={track} aria-hidden>
					<div className="flex h-full w-full">
						{parts.map((s) => (
							<div
								key={s.key}
								className={swatch(s)}
								style={{ width: width(s.amount) }}
							/>
						))}
					</div>
				</div>
				{legend ? (
					<div
						className={cn("flex flex-wrap items-center gap-4", legendClassName)}
					>
						{parts.map((s) => (
							<div key={s.key} className="flex items-center gap-1.5">
								<span
									className={cn("size-1.5 shrink-0 rounded-full", swatch(s))}
									aria-hidden
								/>
								<span className="text-[11px] text-muted-fg">
									{s.label ?? s.key}
								</span>
								<span className="text-[11px] font-medium text-ink tabular-nums">
									{s.amount}
								</span>
							</div>
						))}
					</div>
				) : (
					<ul className="sr-only">
						{parts.map((s) => (
							<li key={s.key}>
								{s.label ?? s.key}: {s.amount}
							</li>
						))}
					</ul>
				)}
			</div>
		);
	}

	const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
	const safeValue = Math.min(
		Math.max(Number.isFinite(value) ? value : 0, 0),
		safeMax,
	);

	if (indeterminate) {
		return (
			<div
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={safeMax}
				// aria-valuenow is deliberately ABSENT: that is how ARIA spells "progress
				// is unknown". A placeholder 0 would be announced as real, stalled progress.
				className={cn(track, className)}
				{...props}
			>
				<span
					className={cn(
						"track-indeterminate absolute inset-y-0 left-0 w-[35%] rounded-[inherit]",
						TONE[tone],
					)}
				/>
			</div>
		);
	}

	return (
		<div
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={safeMax}
			aria-valuenow={safeValue}
			className={cn(track, className)}
			{...props}
		>
			<div
				className={cn(
					"h-full rounded-[inherit] transition-[width] duration-300",
					TONE[tone],
				)}
				style={{ width: `${(safeValue / safeMax) * 100}%` }}
			/>
		</div>
	);
}
