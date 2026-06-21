// biome-ignore-all lint/a11y/useSemanticElements: styled control, accessible via role + aria-checked + keyboard
"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "./cn";

export type CheckboxProps = {
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	id?: string;
	className?: string;
	"aria-label"?: string;
};

export function Checkbox({
	checked,
	defaultChecked = false,
	onCheckedChange,
	disabled,
	id,
	className,
	...aria
}: CheckboxProps) {
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
			role="checkbox"
			aria-checked={on}
			disabled={disabled}
			onClick={toggle}
			className={cn(
				"grid size-5 place-items-center rounded-[6px] border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50",
				on ? "border-transparent bg-primary" : "border-field-border bg-field",
				className,
			)}
			{...aria}
		>
			{on && (
				<Check
					className="size-[13px] text-primary-fg"
					strokeWidth={3}
					aria-hidden
				/>
			)}
		</button>
	);
}
