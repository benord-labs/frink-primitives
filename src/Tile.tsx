import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

// Shared objectBoundingBox clipPath - the utazon diagonal-cut top-right corner
// (rounded joins). Render ONCE near the app root (layout) so every .clip-diagonal-cut
// element can reference it regardless of size.
export function DiagonalCutDefs() {
	return (
		<svg
			aria-hidden
			width={0}
			height={0}
			className="absolute"
			style={{ position: "absolute" }}
		>
			<title>Frink tile clip</title>
			<defs>
				<clipPath id="frink-diagonal-cut" clipPathUnits="objectBoundingBox">
					<path d="M0,0 L0.69,0 Q0.72,0 0.73,0.015 L0.985,0.27 Q1,0.285 1,0.31 L1,1 L0,1 Z" />
				</clipPath>
			</defs>
		</svg>
	);
}

export interface TileProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
	/** Project / feature title (set italic, the utazon treatment). */
	title: string;
	/** Category / eyebrow under the title (e.g. "Automation"). */
	meta?: string;
	/** Year, nestled into the cut corner. */
	year?: string | number;
	/** Makes the whole tile a link. */
	href?: string;
	/** Media (img / video / canvas / shader). Clipped to the diagonal cut. */
	media?: ReactNode;
}

/**
 * The signature Frink surface (faithful to utazon.fr/projects): a rounded,
 * hairline-bordered near-black card whose media is clipped to a single
 * diagonal-cut top-right corner, with the year in the cut and the title +
 * category overlaid bottom-left over a legibility scrim. Requires
 * <DiagonalCutDefs/> mounted once at the app root.
 */
export function Tile({
	title,
	meta,
	year,
	href,
	media,
	className,
	...props
}: TileProps) {
	const cardClass = cn(
		"group tile-rim block rounded-[22px] bg-bg p-3 transition-shadow duration-300 sm:p-4",
		href &&
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
		className,
	);

	const inner = (
		<div className="relative aspect-video w-full overflow-hidden rounded-[14px] bg-bg">
			<div className="clip-diagonal-cut absolute inset-0">
				{media ?? <div className="h-full w-full bg-elevated" />}
			</div>
			{/* legibility scrim for the overlaid metadata */}
			<div
				className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent"
				aria-hidden
			/>
			{year != null && (
				<span className="absolute top-2.5 right-4 font-mono text-xs text-muted">
					{year}
				</span>
			)}
			<div className="absolute right-4 bottom-3.5 left-4 sm:bottom-4">
				<h3 className="text-[15px] font-semibold text-ink italic">{title}</h3>
				{meta && (
					<p className="mt-1 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
						{meta}
					</p>
				)}
			</div>
		</div>
	);

	if (href) {
		return (
			<a
				href={href}
				className={cardClass}
				{...(props as HTMLAttributes<HTMLAnchorElement>)}
			>
				{inner}
			</a>
		);
	}
	return (
		<div className={cardClass} {...(props as HTMLAttributes<HTMLDivElement>)}>
			{inner}
		</div>
	);
}
