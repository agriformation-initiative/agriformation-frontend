import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FieldBase {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

const control =
  'w-full rounded-md border bg-white px-4 py-2.5 text-base text-stone-900 placeholder:text-stone-500 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/25 disabled:bg-stone-100';

const borderFor = (error?: string) => (error ? 'border-red-600' : 'border-stone-300');

function Wrapper({ id, label, error, hint, optional, children }: FieldBase & { children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-stone-800">
        {label}
        {optional && <span className="ml-1 font-normal text-stone-500">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-sm text-stone-600">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

export function TextField({ label, error, hint, optional, id, ...rest }: FieldBase & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper {...{ id, label, error, hint, optional }}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        className={`${control} ${borderFor(error)}`}
        {...rest}
      />
    </Wrapper>
  );
}

export function TextAreaField({ label, error, hint, optional, id, ...rest }: FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper {...{ id, label, error, hint, optional }}>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        className={`${control} resize-y ${borderFor(error)}`}
        {...rest}
      />
    </Wrapper>
  );
}

export function SelectField({ label, error, hint, optional, id, children, ...rest }: FieldBase & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper {...{ id, label, error, hint, optional }}>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        className={`${control} ${borderFor(error)}`}
        {...rest}
      >
        {children}
      </select>
    </Wrapper>
  );
}
