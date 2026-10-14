import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import { getSiteContent } from '@/lib/settings';
import { PARTNERS, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Transparency',
  description: 'Who we are, what we have done so far, what donations pay for and who we work with.',
};

const ORIGIN_FACT = { value: '98%', label: 'Of students dropped agriculture by SS2 at the school where AgroNext began', note: '' };

const COSTS = [
  { amount: '₦25,000', what: 'sponsors one student on a farm excursion' },
  { amount: '₦50,000', what: 'provides learning materials for a classroom' },
  { amount: '₦100,000', what: 'sets up a practical learning garden in a school' },
];

export default async function TransparencyPage() {
  const { stats, programs } = await getSiteContent();
  const facts = [ORIGIN_FACT, ...stats];

  return (
    <>
      <PageHero
        eyebrow="Transparency"
        title="What we have done and what your support pays for"
        description="We would rather show our work than ask you to trust it. This page sets out the facts, the costs and who we work with."
      />

      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="So far" title="Where we are today" description="Our headline figures, kept up to date as the work moves on." />
          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col">
                <dd className="order-1 font-display text-4xl font-semibold tabular-nums text-brand-700">{f.value}</dd>
                <dt className="order-2 mt-1 text-stone-700">{f.label}</dt>
                {f.note && <dd className="order-3 mt-1 text-sm text-stone-600">{f.note}</dd>}
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Donations" title="What your gift pays for" />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {COSTS.map((c) => (
              <li key={c.amount} className="rounded-xl bg-brand-50 p-6">
                <p className="font-display text-3xl font-semibold tabular-nums text-brand-800">{c.amount}</p>
                <p className="mt-2 text-stone-700">{c.what}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-stone-700">
            Every donor receives a payment receipt from Paystack. If you would like to know how a gift was used, write to{' '}
            <a href={`mailto:${SITE.email}`} className="font-medium text-brand-700 underline underline-offset-4">{SITE.email}</a>.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Our work" title="What our programs aim to do" />
          <ol className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
            {programs.map((p) => (
              <li key={p.title} className="grid gap-2 py-5 md:grid-cols-12 md:gap-8">
                <h3 className="font-sans text-lg font-semibold md:col-span-5">{p.title}</h3>
                <p className="text-stone-700 md:col-span-5">{p.impact || p.short}</p>
                <p className="text-sm font-medium text-brand-800 md:col-span-2 md:text-right">{p.timeline}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Organisation" title="Who runs AgroNext" />
            <p className="mt-4 text-stone-700">
              AgroNext was founded by Ovieyi Chinedu-Obioha, an Agricultural Economics graduate, after she taught
              Agricultural Science during her NYSC year.
            </p>
            {SITE.registration && (
              <p className="mt-3 text-stone-700">
                Registration number: <span className="font-medium text-stone-900">{SITE.registration}</span>
              </p>
            )}
            <Button href="/about" variant="secondary" className="mt-6">Read our story</Button>
          </div>
          <div>
            <SectionHeader eyebrow="Partners" title="Who we work with" />
            <ul className="mt-4 space-y-4">
              {PARTNERS.map((p) => (
                <li key={p.name}>
                  <p className="font-semibold text-stone-900">{p.name}</p>
                  <p className="text-stone-700">{p.role}</p>
                </li>
              ))}
            </ul>
            <Button href="/partner" variant="secondary" className="mt-6">Become a partner</Button>
          </div>
        </div>
      </section>
    </>
  );
}
