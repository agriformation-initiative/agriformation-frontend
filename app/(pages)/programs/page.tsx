import type { Metadata } from 'next';
import Image from 'next/image';
import { Check } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import Button from '@/components/ui/Button';
import { getSiteContent } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'How AgroNext works with schools: school gardens, teacher training, farm excursions and internships.',
};

export default async function ProgramsPage() {
  const { programs } = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Programs that make agriculture worth choosing"
        description="Programs designed to make agriculture exciting, respected and rewarding for Nigerian students."
      />

      <div className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl space-y-20 md:space-y-28">
          {programs.map((p, i) => (
            <article key={p.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className={`relative aspect-4/3 overflow-hidden rounded-xl bg-stone-200 ${i % 2 ? 'lg:order-2' : ''}`}>
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
              <div>
                {p.timelineLong && <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">{p.timelineLong}</p>}
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{p.title}</h2>
                <p className="mt-4 text-lg text-stone-700">{p.description}</p>

                {p.activities.length > 0 && (
                  <>
                    <h3 className="mt-8 font-sans text-sm font-semibold text-stone-900">Key activities</h3>
                    <ul className="mt-3 space-y-2">
                      {p.activities.map((a) => (
                        <li key={a} className="flex items-start gap-3 text-stone-700">
                          <Check size={18} className="mt-1 shrink-0 text-brand-700" aria-hidden="true" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {p.impact && (
                  <p className="mt-8 rounded-md bg-brand-50 p-4 text-brand-900">
                    <span className="font-semibold">Aim: </span>
                    {p.impact}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <CtaBand
        title="Support these programs"
        description="Volunteer with a school garden or workshop, or talk to us about partnering to reach more schools."
      >
        <Button href="/schools" variant="inverse">Request a program for your school</Button>
        <Button href="/volunteer" variant="inverse-outline">Volunteer</Button>
        <Button href="/partner" variant="inverse-outline">Become a partner</Button>
      </CtaBand>
    </>
  );
}
