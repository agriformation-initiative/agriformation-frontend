import type { ReactNode } from 'react';

interface CtaBandProps {
  title: string;
  description: string;
  children: ReactNode;
}

/** Closing call to action shared by the public pages. */
export default function CtaBand({ title, description, children }: CtaBandProps) {
  return (
    <section className="bg-brand-900 px-5 py-20 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold !text-white md:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-brand-100">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">{children}</div>
        </div>
      </div>
    </section>
  );
}
