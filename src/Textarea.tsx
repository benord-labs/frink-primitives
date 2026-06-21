import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from './cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      data-error={error || undefined}
      className={cn(
        'w-full resize-y rounded-[10px] border border-field-border bg-field px-3 py-2.5 text-sm text-ink outline-none transition-[border-color,box-shadow]',
        'placeholder:text-muted caret-primary',
        'focus:border-primary focus:ring-2 focus:ring-primary/25',
        'data-[error=true]:border-danger data-[error=true]:focus:ring-danger/25',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});
