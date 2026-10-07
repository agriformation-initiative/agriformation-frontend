import type { Metadata } from 'next';
import { Handshake, Sprout, Megaphone } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import InquiryForm from '@/components/shared/InquiryForm';

export const metadata: Metadata = {
  title: 'Partner with us',
  description: 'Farms, companies, funders and organisations can partner with AgroNext to reach more Nigerian students.',
};

const WAYS = [
  { Icon: Sprout, title: 'Host a farm visit or internship', text: 'Open your farm or business to students for an excursion or a summer placement.' },
  { Icon: Handshake, title: 'Fund a program', text: 'Sponsor excursions, school gardens or learning materials for a school.' },
  { Icon: Megaphone, title: 'Share expertise', text: 'Give career talks, mentor students or support our teachers.' },
];

export default function PartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="Partnerships"
        title="Partner with AgroNext"
        description="We work with farms, businesses, funders and community groups to give Nigerian students real experience of agriculture."
        image={{ src: '/images/excursion1.jpg', alt: 'Students on a guided farm excursion' }}
        priority
      />

      <section className="bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="How to help" title="Ways to partner" />
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {WAYS.map(({ Icon, title, text }) => (
              <li key={title}>
                <Icon size={28} className="text-brand-700" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-1 text-stone-700">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="enquire" className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-2xl">
          <SectionHeader eyebrow="Get in touch" title="Start a conversation" description="Tell us who you are and how you would like to help." />
          <div className="mt-10">
            <InquiryForm
              type="partner"
              submitLabel="Send enquiry"
              messageLabel="How would you like to partner?"
              successTitle="Enquiry received"
              successText="Thank you. We will reply by email to continue the conversation."
            />
          </div>
        </div>
      </section>
    </>
  );
}
