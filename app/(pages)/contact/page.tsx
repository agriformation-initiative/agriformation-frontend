import type { Metadata } from 'next';
import { Mail, ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import Button from '@/components/ui/Button';
import SocialIcon from '@/components/shared/SocialIcon';
import InquiryForm from '@/components/shared/InquiryForm';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with AgroNext about partnerships, volunteering or our programs.',
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact AgroNext"
        description="Whether you want to partner, volunteer or learn more about our work, we would like to hear from you."
        image={{ src: '/images/happy-students.jpg', alt: 'Students smiling during a program visit' }}
        priority
      >
        <Button href="#contact-form">Send a message</Button>
      </PageHero>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold">Reach us directly</h2>
            <ul className="mt-8 space-y-6">
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-100 text-brand-800">
                  <Mail size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-stone-900">Email</p>
                  <a href={`mailto:${SITE.email}`} className="break-all text-brand-700 underline-offset-4 hover:underline">
                    {SITE.email}
                  </a>
                </div>
              </li>
              {SITE.socials.map((s) => (
                <li key={s.label} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-100 text-brand-800">
                    <SocialIcon label={s.label} />
                  </span>
                  <div>
                    <p className="font-semibold text-stone-900">{s.label}</p>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-700 underline-offset-4 hover:underline"
                    >
                      Follow our page <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div id="contact-form" className="lg:col-span-3">
            <h2 className="mb-6 text-3xl font-semibold">Send a message</h2>
            <InquiryForm
              type="contact"
              submitLabel="Send message"
              messageLabel="Message"
              successTitle="Message sent"
              successText="Thank you. A member of the team will reply to the email address you gave."
            />
          </div>
        </div>
      </section>
    </>
  );
}
