// biome-ignore-all lint/a11y/useSemanticElements: styled control, accessible via role + aria-checked + keyboard
"use client";

import { useState } from "react";
import { cn } from "./cn";

export type SwitchProps = {
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	id?: string;
	className?: string;
	"aria-label"?: string;
};

export function Switch({
	checked,
	defaultChecked = false,
	onCheckedChange,
	disabled,
	id,
	className,
	...aria
}: SwitchProps) {
	const [internal, setInternal] = useState(defaultChecked);
	const on = checked ?? internal;

	const toggle = () => {
		if (disabled) return;
		const next = !on;
		if (checked === undefined) setInternal(next);
		onCheckedChange?.(next);
	};

	return (
		<button
			id={id}
			type="button"
			role="switch"
			aria-checked={on}
			disabled={disabled}
			onClick={toggle}
			className={cn(
				"relative inline-flex h-6 w-11 items-center rounded-full border p-[3px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50",
				on
					? "border-transparent bg-primary"
					: "border-field-border bg-elevated",
				className,
			)}
			{...aria}
		>
			<span
				className={cn(
					"size-[18px] rounded-full shadow-[0_1px_2px_#00000073] transition-transform",
					on ? "translate-x-5 bg-white" : "translate-x-0 bg-muted",
				)}
			/>
		</button>
	);
}
