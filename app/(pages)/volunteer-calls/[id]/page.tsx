import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin, Users } from 'lucide-react';
import CallApplyForm from './CallApplyForm';
import { apiGet } from '@/lib/api-server';
import { daysUntil, formatDate, titleCase } from '@/lib/format';
import type { PublicVolunteerCall } from '@/types/indexes';

type Params = { params: Promise<{ id: string }> };

const getCall = async (id: string) =>
  (await apiGet<{ call: PublicVolunteerCall }>(`/volunteer-calls/${encodeURIComponent(id)}`, 30))?.call ?? null;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const call = await getCall((await params).id);
  return call ? { title: call.title, description: call.description.slice(0, 160) } : { title: 'Opportunity not found' };
}

export default async function VolunteerCallPage({ params }: Params) {
  const call = await getCall((await params).id);
  if (!call) notFound();

  const left = daysUntil(call.deadline);
  const closed = left < 0 || call.status === 'closed';

  const facts = [
    { Icon: Calendar, label: 'Event date', value: formatDate(call.eventDate) },
    { Icon: MapPin, label: 'Location', value: call.location },
    { Icon: Users, label: 'Volunteers needed', value: String(call.numberOfVolunteers) },
    { Icon: Clock, label: 'Apply by', value: formatDate(call.deadline) },
  ];

  return (
    <div className="px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-6xl">
        <Link href="/volunteer#opportunities" className="inline-flex min-h-11 items-center gap-2 font-medium text-stone-700 hover:text-brand-800">
          <ArrowLeft size={18} aria-hidden="true" /> All opportunities
        </Link>

        <div className="mt-4 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">{titleCase(call.category)}</p>
            <h1 className="mt-3 text-3xl font-semibold md:text-5xl">{call.title}</h1>

            <div className="relative mt-8 aspect-video overflow-hidden rounded-xl bg-stone-200">
              <Image
                src={call.designImage.url}
                alt={`Poster for ${call.title}`}
                fill
                priority
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
              />
            </div>

            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              {facts.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={20} className="mt-0.5 shrink-0 text-brand-700" aria-hidden="true" />
                  <div>
                    <dt className="text-sm text-stone-600">{label}</dt>
                    <dd className="font-medium text-stone-900">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <h2 className="mt-12 text-2xl font-semibold">About this opportunity</h2>
            <p className="mt-3 whitespace-pre-wrap text-stone-700">{call.description}</p>

            <h2 className="mt-10 text-2xl font-semibold">Requirements</h2>
            <p className="mt-3 whitespace-pre-wrap text-stone-700">{call.requirements}</p>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl bg-white p-6">
              {closed ? (
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Applications are closed</h2>
                  <p className="mt-2 text-stone-700">This opportunity is no longer taking applications.</p>
                  <Link href="/volunteer#opportunities" className="mt-4 inline-flex min-h-11 items-center font-semibold text-brand-700 hover:underline">
                    See other opportunities
                  </Link>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">Apply for this role</h2>
                  {left <= 7 && (
                    <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm font-medium text-amber-900">
                      {left <= 1 ? 'Last day to apply' : `${left} days left to apply`}
                    </p>
                  )}
                  <div className="mt-5">
                    <CallApplyForm callId={call._id} />
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
