import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import CtaBand from '@/components/ui/CtaBand';
import CountUp from '@/components/ui/CountUp';
import RecentWork from '@/components/shared/RecentWork';
import { getSiteContent } from '@/lib/settings';

const STAT_COLUMNS: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  5: 'sm:grid-cols-3 lg:grid-cols-5',
  6: 'sm:grid-cols-3 lg:grid-cols-6',
};

export default async function HomePage() {
  const { stats, programs } = await getSiteContent();

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-50 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-700">
              Agricultural education in Nigeria
            </p>
            <h1 className="text-4xl font-semibold md:text-6xl">
              Make agriculture the career students <em className="text-brand-700">choose</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
              We work with schools and communities to close the gap between theory and practice, showing Nigerian
              students that agriculture is a field of dignity, opportunity and national development.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/programs">Explore our programs</Button>
              <Button href="/volunteer" variant="secondary">Volunteer with us</Button>
            </div>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-stone-200">
            <Image
              src="/images/group.jpg"
              alt="Students from Government Girls' Secondary School Rumuokuta gathered in a school garden"
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Impact: edited in the admin under Site content */}
      <section className="bg-white px-5 py-16 md:px-8" aria-label="Our impact">
        <dl className={`mx-auto grid max-w-6xl gap-10 ${STAT_COLUMNS[Math.min(stats.length, 6)]}`}>
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="order-2 mt-1 text-lg font-semibold text-stone-900">{s.label}</dt>
              <dd className="order-1 font-display text-5xl font-semibold tabular-nums text-brand-700"><CountUp value={s.value} /></dd>
              {s.note && <dd className="order-3 mt-1 text-sm text-stone-600">{s.note}</dd>}
            </div>
          ))}
        </dl>
      </section>

      {/* What we do */}
      <section className="px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="What we do"
            title="Programs that put students on the farm"
            description="Each program moves students from curiosity in the classroom to real experience in the field."
          />
          <ol className="mt-12 divide-y divide-stone-200 border-y border-stone-200">
            {programs.map((p, i) => (
              <li key={p.title} className="grid gap-4 py-8 md:grid-cols-12 md:gap-8">
                <span className="font-display text-3xl font-semibold text-brand-300 md:col-span-1" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="md:col-span-8">
                  <h3 className="text-2xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-stone-600">{p.short}</p>
                </div>
                <p className="text-sm font-medium text-brand-800 md:col-span-3 md:text-right">{p.timeline}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/programs">See program details</Button>
            <Button href="/schools" variant="secondary">Request a program for your school</Button>
          </div>
        </div>
      </section>

      {/* What we did and are doing: newest published albums and posts */}
      <div className="bg-white">
        <RecentWork />
      </div>

      {/* Where it began */}
      <section className="px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-stone-200 lg:order-2">
            <Image
              src="/images/ex.jpg"
              alt="Our founder speaking to students during our first farm excursion"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:order-1">
            <SectionHeader eyebrow="Where it began" title="One classroom, one excursion" />
            <div className="mt-6 space-y-4 text-stone-700">
              <p>
                During her NYSC service year, our founder taught Agricultural Science at Government Girls&apos;
                Secondary School Rumuokuta. By SS2, more than 98% of students had dropped the subject because
                they saw it as punishment.
              </p>
              <p>
                In 2024 she took 83 of them to see modern agriculture at Ibiteinye Inye Integrated Farms. The shift
                was immediate, and it became the start of AgroNext. We have kept working with schools since.
              </p>
            </div>
            <Link
              href="/about"
              className="group mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-brand-700 hover:text-brand-900"
            >
              Read the full story
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="Help us reach more schools"
        description="Volunteer your time, or get in touch about partnering with us to bring these programs to more students across Nigeria."
      >
        <Button href="/volunteer" variant="inverse">Volunteer</Button>
        <Button href="/partner" variant="inverse-outline">Partner with us</Button>
      </CtaBand>
    </>
  );
}
