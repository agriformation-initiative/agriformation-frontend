import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'inverse' | 'inverse-outline' | 'danger';

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; loading?: boolean };
type LinkProps = CommonProps & { href: string; loading?: undefined };

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-base font-semibold transition-colors duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800',
  secondary: 'border border-stone-300 bg-white text-stone-800 hover:border-brand-700 hover:text-brand-800',
  inverse: 'bg-white text-brand-900 hover:bg-brand-50',
  'inverse-outline': 'border border-white/70 text-white hover:bg-white/10',
  danger: 'bg-red-700 text-white hover:bg-red-800',
};

export default function Button(props: ButtonProps | LinkProps) {
  if (props.href !== undefined) {
    const { href, children, variant = 'primary', fullWidth, className = '' } = props;
    const classes = `${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;
    // Hash links stay on the page, so a plain anchor keeps native smooth scrolling
    return href.startsWith('#') ? (
      <a href={href} className={classes}>{children}</a>
    ) : (
      <Link href={href} className={classes}>{children}</Link>
    );
  }

  const { children, variant = 'primary', fullWidth, className = '', loading, disabled, type = 'button', ...rest } = props;
  const classes = `${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;
  return (
    <button {...rest} type={type} disabled={disabled || loading} className={classes}>
      {loading && <Loader2 className="animate-spin" size={18} aria-hidden="true" />}
      {children}
    </button>
  );
}
