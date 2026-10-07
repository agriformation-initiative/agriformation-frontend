import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Eye, Target, Heart } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import CtaBand from '@/components/ui/CtaBand';
import RecentWork from '@/components/shared/RecentWork';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About',
  description:
    'AgroNext is a social enterprise changing how agriculture is taught in Nigeria through practical learning and community engagement.',
};

const VALUES = ['Innovation', 'Collaboration', 'Dignity', 'Sustainability', 'Excellence'];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="About AgroNext"
        description="A social enterprise changing how agriculture is taught in Nigeria, through practical learning and community engagement."
        image={{ src: '/images/student.jpg', alt: 'Our founder teaching a class of students' }}
        priority
      />

      <section className="bg-white px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-stone-200">
            <Image
              src="/images/excursion.jpg"
              alt="Students listening to a presentation at Ibiteinye Inye Integrated Farms"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div>
            <SectionHeader eyebrow="Origin story" title="How it started" />
            <div className="mt-6 space-y-4 text-stone-700">
              <p>
                AgroNext began with a classroom. During her National Youth Service Corps year, our founder,{' '}
                <strong>Ovieyi Chinedu-Obioha</strong>, taught Agricultural Science at Government Girls&apos;
                Secondary School Rumuokuta in Rivers State.
              </p>
              <p>
                She saw that over <strong>98% of students dropped agriculture by SS2</strong>, linking it with
                punishment and labour. To shift that view, she organised an excursion for 83 students to{' '}
                <em>Ibiteinye Inye Integrated Farms</em>.
              </p>
              <p>
                There, students explored poultry, aquaculture, greenhouses, orchards and agro-processing
                machinery. They left seeing agriculture as a career of <strong>innovation and dignity</strong>.
                That day became the start of this initiative, and we have kept working with schools since.
              </p>
            </div>
            <Link
              href="/gallery"
              className="group mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-brand-700 hover:text-brand-900"
            >
              See our photo gallery
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <RecentWork heading="What we have been doing" />

      <section className="px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="What guides us" title="Vision, mission and values" />
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <div>
              <Eye className="text-brand-700" size={28} aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">Vision</h3>
              <p className="mt-2 text-stone-700">
                To reimagine agricultural education in Nigeria by raising a generation who see agriculture as
                innovation, sustainability and national development.
              </p>
            </div>
            <div>
              <Target className="text-brand-700" size={28} aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">Mission</h3>
              <p className="mt-2 text-stone-700">
                To change how agriculture is taught through practical learning, partnerships, mentorship and
                community engagement.
              </p>
            </div>
            <div>
              <Heart className="text-brand-700" size={28} aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">Core values</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {VALUES.map((v) => (
                  <li key={v} className="rounded-full bg-brand-100 px-3 py-1.5 text-sm font-medium text-brand-900">
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Leadership" title="Meet our founder" />
          <div className="mt-12 grid items-start gap-10 md:grid-cols-5 md:gap-14">
            <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-stone-200 md:col-span-2">
              <Image
                src="/images/ovieyi.jpg"
                alt="Ovieyi Chinedu-Obioha, founder and lead program manager"
                fill
                sizes="(min-width: 768px) 400px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="md:col-span-3">
              <h3 className="text-3xl font-semibold">Ovieyi Chinedu-Obioha</h3>
              <p className="mt-1 font-semibold text-brand-700">Founder and Lead Program Manager</p>
              <p className="mt-6 text-stone-700">
                With a background in <strong>Agricultural Economics</strong> and over three years in grassroots
                development, Ovieyi is committed to changing how agriculture is taught. Her NYSC classroom
                revealed the gaps, and the farm excursion she organised showed what closing them could look like.
              </p>
              <blockquote className="mt-8 rounded-md bg-brand-50 p-6 font-display text-xl italic leading-snug text-brand-900">
                &ldquo;If we don&rsquo;t inspire today&rsquo;s students to see agriculture differently, Nigeria
                risks a food crisis tomorrow. But if we act now, we can raise a generation of innovators who will
                feed the nation.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Join the work"
        description="Explore our programs, partner with us, or volunteer to help change how Nigeria's next generation sees agriculture."
      >
        <Button href="/programs" variant="inverse">Explore programs</Button>
        <Button href="/contact" variant="inverse-outline">Get in touch</Button>
      </CtaBand>
    </>
  );
}
