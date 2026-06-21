// biome-ignore-all lint/a11y/noLabelWithoutControl: reusable label primitive; consumer supplies htmlFor
import type { LabelHTMLAttributes } from "react";
import { cn } from "./cn";

export function Label({
	className,
	...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
	return (
		<label
			className={cn("text-[13px] font-medium text-muted", className)}
			{...props}
		/>
	);
}
