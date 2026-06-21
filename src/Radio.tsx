// biome-ignore-all lint/a11y/useSemanticElements: styled control, accessible via role + aria-checked + keyboard
'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';
import { cn } from './cn';

interface RadioCtx {
  value: string | undefined;
  onChange: (value: string) => void;
  name: string;
}
const Ctx = createContext<RadioCtx | null>(null);

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  className?: string;
  children: ReactNode;
}

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  name = 'radio-group',
  className,
  children,
}: RadioGroupProps) {
  const [internal, setInternal] = useState(defaultValue);
  const selected = value ?? internal;

  const onChange = (v: string) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <Ctx.Provider value={{ value: selected, onChange, name }}>
      <div role="radiogroup" className={cn('flex flex-col gap-2', className)}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export interface RadioProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Radio({ value, disabled, className, children }: RadioProps) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('Radio must be used within a RadioGroup');
  const on = ctx.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      disabled={disabled}
      onClick={() => ctx.onChange(value)}
      className={cn(
        'flex items-center gap-2.5 text-left outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <span
        className={cn(
          'grid size-5 place-items-center rounded-full border bg-field transition-colors',
          on ? 'border-[1.5px] border-primary' : 'border-field-border',
        )}
      >
        {on && <span className="size-[9px] rounded-full bg-primary" />}
      </span>
      {children && <span className="text-sm text-ink">{children}</span>}
    </button>
  );
}
