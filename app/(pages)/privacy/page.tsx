import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What personal information AgroNext collects through this website, why, and your choices.',
};

interface Section {
  title: string;
  body?: string[];
  list?: string[];
}

const SECTIONS: Section[] = [
  {
    title: 'Who we are',
    body: [
      `${SITE.fullName} runs this website. In this policy "we" and "us" mean AgroNext. You can reach us at ${SITE.email}.`,
    ],
  },
  {
    title: 'What we collect and why',
    list: [
      'Contact messages, school requests and partner enquiries: your name, email address, phone number if you give it, your school or organisation, and your message. We use this to reply to you.',
      'Volunteer applications: your name, email address, phone number (for specific opportunities), preferred role and what you tell us about yourself. We use this to review your application and to contact you about it.',
      'Volunteer accounts: if you are accepted, we create an account with your name, email address and a password you choose. Passwords are stored in a scrambled form that we cannot read.',
      'Donations: you pay on a page run by our payment provider, Paystack. We receive your name, email address, the amount and a payment reference. We never see or store your card or bank details.',
    ],
  },
  {
    title: 'Who sees your information',
    body: [
      'Only the AgroNext team members who need it to do their work. We use Zoho Mail to send and receive email and Paystack to take payments. We do not sell your information or share it for advertising.',
    ],
  },
  {
    title: 'How long we keep it',
    body: [
      'We keep messages and applications for as long as we need them to deal with your request and to keep a record of our work. You can ask us to delete your information at any time.',
    ],
  },
  {
    title: 'Photographs',
    body: [
      'Our gallery and blog show photographs from our programs. If you appear in a photograph and want it removed, write to us and we will take it down.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'Under the Nigeria Data Protection Act you can ask to see the information we hold about you, correct it, or have it deleted, and you can object to how we use it. Write to us at the address above and we will respond.',
    ],
  },
  {
    title: 'Cookies and storage',
    body: [
      'We do not use advertising or tracking cookies. When you sign in to a volunteer or admin account, your browser stores a sign-in token so you stay signed in.',
    ],
  },
  {
    title: 'Changes to this policy',
    body: ['If we change this policy we will update this page.'],
  },
];

export default function PrivacyPage() {
  return (
    <div className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Privacy policy</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">How we handle your information</h1>
        <p className="mt-4 text-lg text-stone-700">
          This page explains what personal information AgroNext collects through this website, why we collect it and what
          choices you have.
        </p>

        {SECTIONS.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="text-2xl font-semibold">{s.title}</h2>
            {s.body?.map((p) => (
              <p key={p} className="mt-3 text-stone-700">{p}</p>
            ))}
            {s.list && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-700">
                {s.list.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
