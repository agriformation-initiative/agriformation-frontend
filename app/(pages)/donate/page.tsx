import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, BookOpen, Sprout } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import DonateForm from './DonateForm';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Fund farm excursions, learning materials and school gardens for Nigerian students.',
};

const IMPACT = [
  { Icon: Users, title: 'Farm excursions', text: '₦25,000 sponsors one student for a farm visit.' },
  { Icon: BookOpen, title: 'Learning materials', text: '₦50,000 provides resources for a classroom.' },
  { Icon: Sprout, title: 'School gardens', text: '₦100,000 sets up a practical learning garden in a school.' },
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Support our mission"
        title="Help students see agriculture as a future"
        description="Your gift helps us move agriculture from punishment to purpose in Nigerian classrooms, one school at a time."
        image={{ src: '/images/happy-students.jpg', alt: 'Students smiling during a farm visit' }}
        priority
      >
        <Button href="#give">Donate</Button>
      </PageHero>

      <section className="bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Your impact" title="What your donation does" />
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {IMPACT.map(({ Icon, title, text }) => (
              <li key={title}>
                <Icon size={28} className="text-brand-700" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-1 text-stone-700">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="give" className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-2xl">
          <SectionHeader
            eyebrow="Give"
            title="Make a donation"
            description="Your gift pays for farm excursions, school gardens and learning materials that change how students see agriculture."
          />
          <p className="mt-3">
            <Link href="/transparency" className="font-medium text-brand-700 underline underline-offset-4">See what gifts pay for</Link>
          </p>
          <div className="mt-10">
            <DonateForm />
          </div>

          {SITE.bank.bankName && SITE.bank.accountName && SITE.bank.accountNumber && (
            <section className="mt-8 rounded-xl bg-white p-6 md:p-8" aria-labelledby="transfer-heading">
              <h2 id="transfer-heading" className="font-sans text-lg font-semibold">Prefer a bank transfer?</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <div><dt className="text-sm text-stone-600">Bank</dt><dd className="font-medium text-stone-900">{SITE.bank.bankName}</dd></div>
                <div><dt className="text-sm text-stone-600">Account name</dt><dd className="font-medium text-stone-900">{SITE.bank.accountName}</dd></div>
                <div><dt className="text-sm text-stone-600">Account number</dt><dd className="font-medium tabular-nums text-stone-900">{SITE.bank.accountNumber}</dd></div>
              </dl>
              <p className="mt-4 text-sm text-stone-600">
                Email {SITE.email} after you pay so we can send you a receipt.
              </p>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
