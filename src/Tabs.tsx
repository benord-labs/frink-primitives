"use client";

import { type ReactNode, useState } from "react";
import { cn } from "./cn";

export type TabItem = {
	value: string;
	label: ReactNode;
};

export type TabsProps = {
	items: TabItem[];
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	className?: string;
};

/** Segmented control / tab switcher: black pill, elevated active segment. */
export function Tabs({
	items,
	value,
	defaultValue,
	onValueChange,
	className,
}: TabsProps) {
	const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
	const selected = value ?? internal;

	const select = (v: string) => {
		if (value === undefined) setInternal(v);
		onValueChange?.(v);
	};

	return (
		<div
			role="tablist"
			className={cn(
				"inline-flex gap-[3px] rounded-full border border-field-border bg-surface p-[3px]",
				className,
			)}
		>
			{items.map((it) => {
				const on = it.value === selected;
				return (
					<button
						key={it.value}
						type="button"
						role="tab"
						aria-selected={on}
						onClick={() => select(it.value)}
						className={cn(
							"rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
							on
								? "bg-primary text-primary-fg shadow-[0_2px_10px_-3px_#8b6cff80]"
								: "text-muted hover:text-ink",
						)}
					>
						{it.label}
					</button>
				);
			})}
		</div>
	);
}
