interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  className = '',
}: SectionHeaderProps) {
  const dark = tone === 'dark';
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && (
        <p className={`mb-3 text-sm font-semibold uppercase tracking-widest ${dark ? 'text-brand-200' : 'text-brand-700'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl font-semibold md:text-4xl ${dark ? '!text-white' : ''}`}>{title}</h2>
      {description && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-brand-100' : 'text-stone-600'}`}>{description}</p>
      )}
    </div>
  );
}
