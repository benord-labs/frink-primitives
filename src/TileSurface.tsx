import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface TileSurfaceProps extends HTMLAttributes<HTMLDivElement> {
	/** Content nestled into the diagonal-cut notch (top-right) — e.g. a year or label. */
	corner?: ReactNode;
	/** Override the inner content padding/layout (defaults to a vertical stack). */
	contentClassName?: string;
}

/**
 * The Frink signature surface (utazon diagonal cut): a rounded, metal-rimmed card
 * whose lighter inner panel carries a fixed-size top-right notch. Wraps arbitrary
 * content (a form, a media block); the `corner` slot sits in the notch.
 * Pairs the `.tile-rim` rim+glow with the `.tile-notch` corner cut.
 */
export function TileSurface({
	corner,
	className,
	contentClassName,
	children,
	...props
}: TileSurfaceProps) {
	return (
		<div
			className={cn("tile-rim relative rounded-[22px] bg-bg p-3", className)}
			{...props}
		>
			<div className="relative overflow-hidden rounded-[14px]">
				{/* panel = pen Tile media tone: field (#0d0d0d) -> surface -> bg, a touch lighter than the frame */}
				<div className="tile-notch absolute inset-0 bg-linear-to-br from-raised to-surface" />
				{corner != null && (
					<div className="absolute top-3 right-4 z-10 font-mono text-xs text-muted-fg">
						{corner}
					</div>
				)}
				<div
					className={cn(
						"relative z-10 flex flex-col gap-6 px-6 pt-12 pb-6",
						contentClassName,
					)}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
