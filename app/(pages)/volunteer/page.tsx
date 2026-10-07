import type { Metadata } from 'next';
import { Calendar, MapPin, Users, Leaf, Camera, Handshake, GraduationCap, Network, Award, Hammer } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import MediaCard from '@/components/shared/MediaCard';
import FilterChips from '@/components/shared/FilterChips';
import GeneralApplicationForm from './GeneralApplicationForm';
import { apiGet } from '@/lib/api-server';
import { daysUntil, formatDate } from '@/lib/format';
import type { PublicVolunteerCall } from '@/types/indexes';

export const metadata: Metadata = {
  title: 'Volunteer',
  description: 'Volunteer with AgroNext. Browse open opportunities or send a general application.',
};

const CATEGORIES = [
  { value: 'all', label: 'All opportunities' },
  { value: 'farm_work', label: 'Farm work' },
  { value: 'event_support', label: 'Event support' },
  { value: 'community_outreach', label: 'Community outreach' },
  { value: 'training', label: 'Training' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'other', label: 'Other' },
];

const ROLES = [
  { Icon: Leaf, title: 'School gardens assistant', text: 'Help set up and support gardens in schools.' },
  { Icon: Users, title: 'Agri-Club facilitator', text: 'Run student activities, mini-lectures and competitions.' },
  { Icon: Camera, title: 'Media and comms', text: 'Document and share our stories to spread awareness.' },
  { Icon: Handshake, title: 'Fundraising and partnerships', text: 'Mobilise resources and build partnerships.' },
];

const BENEFITS = [
  { Icon: Hammer, title: 'Hands-on experience', text: 'Training and mentorship from experts.' },
  { Icon: GraduationCap, title: 'Skill development', text: 'Build leadership and project skills.' },
  { Icon: Network, title: 'Networking', text: 'Meet changemakers in agriculture.' },
  { Icon: Award, title: 'Recognition', text: 'Receive certificates for your service.' },
];

export default async function VolunteerPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = 'all' } = await searchParams;
  const active = CATEGORIES.some((c) => c.value === category) ? category : 'all';
  const data = await apiGet<{ calls: PublicVolunteerCall[] }>(
    `/volunteer-calls${active !== 'all' ? `?category=${active}` : ''}`,
    30
  );
  const calls = data?.calls ?? [];

  return (
    <>
      <PageHero
        eyebrow="Volunteer with us"
        title="Give your time to a student's future"
        description="Join a community changing how agriculture is taught in Nigeria. Your skills can inspire the next generation."
        image={{ src: '/images/teacher.jpg', alt: 'A volunteer teaching students' }}
        priority
      >
        <Button href="#opportunities">Browse opportunities</Button>
        <Button href="#apply" variant="secondary">General application</Button>
      </PageHero>

      <section id="opportunities" className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Current openings"
            title="Open volunteer calls"
            description="Apply directly to an event or program that matches your interests."
          />
          <div className="mt-8">
            <FilterChips basePath="/volunteer" param="category" options={CATEGORIES} active={active} label="Filter opportunities by category" />
          </div>

          {data === null ? (
            <p role="alert" className="mt-10 rounded-xl bg-white p-10 text-center text-stone-700">
              We could not load the opportunities just now. Please refresh the page in a moment.
            </p>
          ) : calls.length === 0 ? (
            <div className="mt-10 rounded-xl bg-white p-10 text-center">
              <p className="text-lg text-stone-700">There are no open calls right now.</p>
              <p className="mt-1 text-stone-600">Send a general application and we will contact you when something fits.</p>
              <Button href="#apply" className="mt-6">Send a general application</Button>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {calls.map((call) => {
                const left = daysUntil(call.deadline);
                const closed = left < 0 || call.status === 'closed';
                return (
                  <MediaCard
                    key={call._id}
                    href={`/volunteer-calls/${call._id}`}
                    image={call.designImage?.url}
                    imageAlt={`Poster for ${call.title}`}
                    muted={closed}
                    badge={
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${closed ? 'bg-stone-800 text-white' : 'bg-white text-brand-800'}`}>
                        {closed ? 'Closed' : left <= 7 ? `${left} ${left === 1 ? 'day' : 'days'} left` : 'Open'}
                      </span>
                    }
                    title={call.title}
                    description={call.description}
                    footer={
                      <ul className="space-y-1.5">
                        <li className="flex items-center gap-2"><Calendar size={15} aria-hidden="true" /> {formatDate(call.eventDate, 'short')}</li>
                        <li className="flex items-center gap-2"><MapPin size={15} aria-hidden="true" /> <span className="line-clamp-1">{call.location}</span></li>
                        <li className="flex items-center gap-2"><Users size={15} aria-hidden="true" /> {call.numberOfVolunteers} volunteers needed</li>
                      </ul>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="General roles" title="Ways to contribute" />
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map(({ Icon, title, text }) => (
              <li key={title}>
                <Icon size={28} className="text-brand-700" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-1 text-stone-700">{text}</p>
              </li>
            ))}
          </ul>

          <h3 className="mt-16 text-2xl font-semibold">What you gain</h3>
          <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ Icon, title, text }) => (
              <li key={title}>
                <Icon size={24} className="text-brand-700" aria-hidden="true" />
                <p className="mt-3 font-semibold text-stone-900">{title}</p>
                <p className="text-stone-700">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-2xl">
          <SectionHeader
            eyebrow="Join us"
            title="General volunteer application"
            description="Not seeing the right opening? Tell us about yourself and we will reach out when something matches."
          />
          <div className="mt-10">
            <GeneralApplicationForm />
          </div>
        </div>
      </section>
    </>
  );
}
