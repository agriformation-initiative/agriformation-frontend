import Link from 'next/link';

interface FilterChipsProps {
  basePath: string;
  param: string;
  options: { value: string; label: string }[];
  active: string;
  label: string;
}

/** Server-rendered filter: each chip is a link, so filtering needs no client JavaScript. */
export default function FilterChips({ basePath, param, options, active, label }: FilterChipsProps) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const isActive = o.value === active;
        return (
          <Link
            key={o.value}
            href={o.value === 'all' ? basePath : `${basePath}?${param}=${o.value}`}
            scroll={false}
            aria-current={isActive ? 'true' : undefined}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brand-700 text-white'
                : 'bg-white text-stone-700 hover:bg-brand-100 hover:text-brand-900'
            }`}
          >
            {o.label}
          </Link>
        );
      })}
    </nav>
  );
}
