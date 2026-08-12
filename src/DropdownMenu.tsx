import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";
import { cn } from "./cn";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export type DropdownMenuContentProps = ComponentPropsWithoutRef<
	typeof DropdownMenuPrimitive.Content
>;

export const DropdownMenuContent = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.Content>,
	DropdownMenuContentProps
>(function DropdownMenuContent({ className, sideOffset = 4, ...props }, ref) {
	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content
				ref={ref}
				sideOffset={sideOffset}
				className={cn(
					"z-50 min-w-32 overflow-hidden rounded-[10px] border border-hairline bg-elevated p-1 text-ink shadow-lg",
					className,
				)}
				{...props}
			/>
		</DropdownMenuPrimitive.Portal>
	);
});

export type DropdownMenuItemTone = "default" | "success" | "danger";

export interface DropdownMenuItemProps
	extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
	/** Semantic text treatment for ordinary, positive, or destructive actions. */
	tone?: DropdownMenuItemTone;
}

const ITEM_TONE: Record<DropdownMenuItemTone, string> = {
	default: "text-ink",
	success: "text-success-fg",
	danger: "text-danger-fg",
};

export const DropdownMenuItem = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.Item>,
	DropdownMenuItemProps
>(function DropdownMenuItem({ className, tone = "default", ...props }, ref) {
	return (
		<DropdownMenuPrimitive.Item
			ref={ref}
			className={cn(
				"relative flex min-h-8 cursor-default select-none items-center gap-1.5 rounded-md px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-raised [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
				ITEM_TONE[tone],
				className,
			)}
			{...props}
		/>
	);
});

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
	typeof DropdownMenuPrimitive.Separator
>;

export const DropdownMenuSeparator = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.Separator>,
	DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, ...props }, ref) {
	return (
		<DropdownMenuPrimitive.Separator
			ref={ref}
			className={cn("my-1 h-px bg-hairline", className)}
			{...props}
		/>
	);
});
