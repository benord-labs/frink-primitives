import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"rounded-[10px] border border-hairline bg-surface shadow-[var(--card-shadow)]",
				className,
			)}
			{...props}
		/>
	);
}

export function CardHeader({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />
	);
}

export function CardTitle({
	className,
	...props
}: HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			className={cn("text-[15px] font-semibold text-ink", className)}
			{...props}
		/>
	);
}

export function CardDescription({
	className,
	...props
}: HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			className={cn("text-[13px] leading-relaxed text-muted", className)}
			{...props}
		/>
	);
}

export function CardContent({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("px-5 pb-5", className)} {...props} />;
}

export function CardFooter({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"flex items-center gap-3 border-t border-hairline px-5 py-4",
				className,
			)}
			{...props}
		/>
	);
}
