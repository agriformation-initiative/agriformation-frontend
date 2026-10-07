import Link from 'next/link';

interface LogoProps {
  tone?: 'dark' | 'light';
  showTagline?: boolean;
  className?: string;
}

/** AgroNext wordmark with a sprout mark. Rendered as SVG so it stays sharp and weighs nothing. */
export default function Logo({ tone = 'dark', showTagline = true, className = '' }: LogoProps) {
  const isLight = tone === 'light';
  return (
    <Link
      href="/"
      aria-label="AgroNext Agricultural Development Initiative, home"
      className={`inline-flex items-center gap-3 rounded-md ${className}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
          isLight ? 'bg-white text-brand-800' : 'bg-brand-700 text-white'
        }`}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
          <path d="M12 21v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 13c0-4 2.5-6.5 7-6.5 0 4-2.5 6.5-7 6.5Z" fill="currentColor" />
          <path d="M12 16c0-3-2-5-6-5 0 3 2 5 6 5Z" fill="currentColor" opacity="0.7" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-xl font-semibold tracking-tight ${
            isLight ? 'text-white' : 'text-brand-900'
          }`}
        >
          AgroNext
        </span>
        {showTagline && (
          <span
            className={`mt-1 text-xs font-medium uppercase tracking-widest ${
              isLight ? 'text-brand-200' : 'text-stone-500'
            }`}
          >
            Agricultural Development Initiative
          </span>
        )}
      </span>
    </Link>
  );
}
