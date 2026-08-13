import type {
	ButtonHTMLAttributes,
	HTMLAttributes,
	MouseEventHandler,
	ReactNode,
} from "react";
import { cn } from "./cn";

export type ActivityRowState =
	| "neutral"
	| "running"
	| "success"
	| "warning"
	| "error";

export type ActivityRowSize = "sm" | "md";

export type ActivityRowTrailingWidth = "compact" | "wide";

const STATE_DOT: Record<ActivityRowState, string> = {
	// --dim stays a quiet, legible signal when consumers reserve --muted for surfaces.
	neutral: "bg-dim",
	running: "bg-online",
	success: "bg-secondary",
	warning: "bg-warning",
	error: "bg-danger",
};

const STATE_LABEL: Record<ActivityRowState, string> = {
	neutral: "Neutral",
	running: "Running",
	success: "Succeeded",
	warning: "Warning",
	error: "Failed",
};

const TRAILING_WIDTH: Record<ActivityRowTrailingWidth, string> = {
	compact: "min-w-7",
	wide: "min-w-24",
};

const SIZE = {
	sm: {
		leading: "size-8 rounded-[9px] [&_svg]:size-3.5",
		row: "gap-2.5 py-2",
		title: "text-xs",
		description: "text-[10px]",
	},
	md: {
		leading: "size-9 rounded-[10px] [&_svg]:size-4",
		row: "gap-3 py-2.5",
		title: "text-[12.5px]",
		description: "text-[11px]",
	},
} as const;

export interface ActivityRowProps
	extends Omit<HTMLAttributes<HTMLLIElement>, "children" | "title"> {
	/** Icon or compact source mark shown on the machined leading plate. */
	leading: ReactNode;
	/** Primary row label. */
	title: ReactNode;
	/** Secondary context displayed beneath the title. */
	description?: ReactNode;
	/** Compact metadata shown before the trailing value. */
	meta?: ReactNode;
	/** Final compact value, usually elapsed time. */
	trailing?: ReactNode;
	/** Independent controls rendered beside, never inside, the row activation target. */
	actions?: ReactNode;
	/** Width preset for the final rail. `wide` aligns lists that mix values and controls. */
	trailingWidth?: ActivityRowTrailingWidth;
	/** Semantic state that drives the status dot and screen-reader copy. */
	state?: ActivityRowState;
	/** Domain-specific screen-reader copy when the visual state is intentionally broader. */
	statusLabel?: string;
	/** Pulses the status dot for live activity without changing semantic state. */
	pulse?: boolean;
	/** Density preset. `md` matches Frink's desktop activity list. */
	size?: ActivityRowSize;
	/** Makes the row a keyboard-native button while retaining list semantics. */
	onActivate?: MouseEventHandler<HTMLButtonElement>;
	/** Props forwarded to the interactive button when `onActivate` is present. */
	actionProps?: Omit<
		ButtonHTMLAttributes<HTMLButtonElement>,
		"children" | "className" | "onClick" | "type"
	>;
	/** Extra classes for the interactive button or static row content. */
	contentClassName?: string;
}

type ActivityRowContentProps = Pick<
	ActivityRowProps,
	| "description"
	| "leading"
	| "meta"
	| "pulse"
	| "state"
	| "statusLabel"
	| "title"
	| "trailing"
	| "trailingWidth"
> & {
	geometry: (typeof SIZE)[ActivityRowSize];
};

function ActivityRowDescription({
	description,
	className,
}: {
	description: ReactNode;
	className: string;
}) {
	if (description == null) return null;

	return (
		<span
			className={cn("mt-0.5 block truncate pl-3.5 text-muted-fg", className)}
		>
			{description}
		</span>
	);
}

function ActivityRowMeta({ meta }: { meta: ReactNode }) {
	if (meta == null) return null;

	return <span className="activity-row-meta shrink-0">{meta}</span>;
}

function ActivityRowTrailingValue({
	trailing,
	trailingWidth = "compact",
}: Pick<ActivityRowProps, "trailing" | "trailingWidth">) {
	if (trailing == null) return null;

	return (
		<span
			className={cn(
				"activity-row-trailing inline-flex shrink-0 items-center justify-end whitespace-nowrap text-right text-[10px] text-muted-fg tabular-nums",
				TRAILING_WIDTH[trailingWidth],
			)}
		>
			{trailing}
		</span>
	);
}

function ActivityRowEnd({
	meta,
	trailing,
	trailingWidth,
}: Pick<ActivityRowProps, "meta" | "trailing" | "trailingWidth">) {
	if (meta == null && trailing == null) return null;

	return (
		<span className="flex shrink-0 items-center gap-2.5">
			<ActivityRowMeta meta={meta} />
			<ActivityRowTrailingValue
				trailing={trailing}
				trailingWidth={trailingWidth}
			/>
		</span>
	);
}

function ActivityRowContent({
	leading,
	title,
	description,
	meta,
	trailing,
	trailingWidth = "compact",
	state = "neutral",
	statusLabel,
	pulse = false,
	geometry,
}: ActivityRowContentProps) {
	return (
		<>
			<span
				className={cn(
					"activity-row-leading flex shrink-0 items-center justify-center text-muted-fg [&_svg]:shrink-0",
					geometry.leading,
				)}
				aria-hidden
			>
				{leading}
			</span>
			<span className="min-w-0 flex-1">
				<span className="flex items-center gap-2">
					<span
						className={cn(
							"size-1.5 shrink-0 rounded-full",
							STATE_DOT[state],
							pulse && "motion-safe:animate-pulse",
						)}
						aria-hidden
					/>
					<span className={cn("truncate font-medium text-ink", geometry.title)}>
						{title}
					</span>
					<span className="sr-only">
						Status: {statusLabel ?? STATE_LABEL[state]}
					</span>
				</span>
				<ActivityRowDescription
					description={description}
					className={geometry.description}
				/>
			</span>
			<ActivityRowEnd
				meta={meta}
				trailing={trailing}
				trailingWidth={trailingWidth}
			/>
		</>
	);
}

/**
 * A compact, divided activity-list row with a source plate, semantic status,
 * truncating copy, and trailing metadata slots. The primitive owns presentation;
 * consumers own domain data, icons, formatting, and activation behavior.
 */
export function ActivityRow({
	leading,
	title,
	description,
	meta,
	trailing,
	actions,
	trailingWidth = "compact",
	state = "neutral",
	statusLabel,
	pulse = false,
	size = "md",
	onActivate,
	actionProps,
	contentClassName,
	className,
	...props
}: ActivityRowProps) {
	const geometry = SIZE[size];
	const content = (
		<ActivityRowContent
			leading={leading}
			title={title}
			description={description}
			meta={meta}
			trailing={trailing}
			trailingWidth={trailingWidth}
			state={state}
			statusLabel={statusLabel}
			pulse={pulse}
			geometry={geometry}
		/>
	);
	const contentClasses = cn(
		"flex w-full min-w-0 items-center text-left",
		geometry.row,
		contentClassName,
	);

	return (
		<li
			className={cn(
				"border-t border-hairline first:border-t-0",
				actions != null && "flex items-center gap-1",
				className,
			)}
			data-state={state}
			data-size={size}
			{...props}
		>
			{onActivate != null ? (
				<button
					type="button"
					className={cn(
						contentClasses,
						"cursor-pointer rounded-[10px] bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
					)}
					onClick={onActivate}
					{...actionProps}
				>
					{content}
				</button>
			) : (
				<div className={contentClasses}>{content}</div>
			)}
			{actions != null && (
				<div className="activity-row-actions flex shrink-0 items-center gap-1">
					{actions}
				</div>
			)}
		</li>
	);
}
