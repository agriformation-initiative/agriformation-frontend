import type { Metadata } from 'next';
import { Users, BookOpen, Sprout } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import DonateForm from './DonateForm';

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
            description="In 2024, we took 83 students on a farm excursion that changed how they see agriculture. With your help we can reach many more."
          />
          <div className="mt-10">
            <DonateForm />
          </div>
        </div>
      </section>
    </>
  );
}
