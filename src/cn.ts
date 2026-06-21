import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Class-name joiner with Tailwind conflict resolution. Later utilities win, so a
 * consumer `className` deterministically overrides a primitive's baked-in utility
 * (e.g. `bg-warning` beats the cva root's `bg-surface`).
 */
export function cn(...parts: ClassValue[]): string {
	return twMerge(clsx(parts));
}
