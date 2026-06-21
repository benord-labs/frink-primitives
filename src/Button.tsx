import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from './cn';

export const buttonVariants = cva(
  'btn inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium leading-none tracking-[0.01em] outline-none transition-[filter,box-shadow,background-color,border-color] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'glow-rim-primary text-primary-fg',
        secondary: 'glow-rim text-ink hover:bg-white/5',
        ghost: 'text-muted hover:bg-white/5 hover:text-ink',
        destructive: 'glow-rim-danger text-danger-200 hover:bg-danger/10',
      },
      size: {
        sm: 'h-9 px-4 text-[13px]',
        md: 'h-10 px-5 text-sm',
        lg: 'h-11 px-7 text-[15px]',
      },
      iconOnly: { true: 'aspect-square px-0', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'href'>,
    VariantProps<typeof buttonVariants> {
  /** Render as an anchor with this href instead of a <button>. */
  href?: string;
  target?: string;
  rel?: string;
  /** Shows a spinner and disables the control. */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    iconOnly,
    loading = false,
    href,
    target,
    rel,
    disabled,
    className,
    children,
    ...props
  },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size, iconOnly }), className);
  const inner = (
    <>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </>
  );

  if (href !== undefined) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-disabled={disabled || loading || undefined}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }

  return (
    <button ref={ref} disabled={disabled || loading} className={classes} {...props}>
      {inner}
    </button>
  );
});
