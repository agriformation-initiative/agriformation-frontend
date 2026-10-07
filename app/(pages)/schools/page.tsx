import type { Metadata } from 'next';
import { Sprout, GraduationCap, Bus } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import InquiryForm from '@/components/shared/InquiryForm';

export const metadata: Metadata = {
  title: 'Bring AgroNext to your school',
  description: 'Schools can ask AgroNext to set up a school garden and Agri-Club, train teachers or host a farm excursion.',
};

const OFFERS = [
  { Icon: Sprout, title: 'School garden and Agri-Club', text: 'A demonstration garden and a weekly club with hands-on activities and competitions.' },
  { Icon: GraduationCap, title: 'Teacher training', text: 'Training for teachers to mentor students and run the garden as Agri-Champions.' },
  { Icon: Bus, title: 'Farm excursion', text: 'A guided visit to a modern integrated farm for your students.' },
];

export default function SchoolsPage() {
  return (
    <>
      <PageHero
        eyebrow="For schools"
        title="Bring AgroNext to your school"
        description="Tell us about your school and what you would like. We will reply to talk through what is possible for your students."
        image={{ src: '/images/group.jpg', alt: 'Students gathered in a school garden' }}
        priority
      />

      <section className="bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="What we can do" title="Ways we work with schools" />
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {OFFERS.map(({ Icon, title, text }) => (
              <li key={title}>
                <Icon size={28} className="text-brand-700" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-1 text-stone-700">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="request" className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-2xl">
          <SectionHeader
            eyebrow="Request a program"
            title="Tell us about your school"
            description="A teacher, principal or parent association member can fill this in."
          />
          <div className="mt-10">
            <InquiryForm
              type="school"
              submitLabel="Send request"
              messageLabel="What would you like help with?"
              messageHint="For example a garden, teacher training or an excursion, and when you have in mind."
              successTitle="Request received"
              successText="Thank you. We will reply by email to talk about next steps for your school."
            />
          </div>
        </div>
      </section>
    </>
  );
}
