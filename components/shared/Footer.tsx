'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SocialIcon from '@/components/shared/SocialIcon';
import { FOOTER_LINKS, NAV_LINKS, SITE, isAppShellPath } from '@/lib/site';
import Image from 'next/image';

const PROGRAMS = [
  'School Gardens & Agri-Clubs',
  'Teacher Training',
  'Farm Excursions',
  'Summer Internships',
];

export const Footer = () => {
  const pathname = usePathname();
  if (isAppShellPath(pathname)) return null;

  return (
    <footer className="bg-brand-950 px-5 py-16 text-brand-100 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
           <Link href="/" className="mb-5 inline-block">
              <Image src="/images/agronext.png" alt="Logo" width={100} height={100}  className="object-fit w-42 h-auto"/>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-brand-200">
              {SITE.tagline}, through practical learning, mentorship and community engagement.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className="mb-4 font-sans text-sm font-semibold text-white">Explore</h2>
            <ul className="space-y-1">
              {NAV_LINKS.filter((l) => l.href !== '/').map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-8 items-center text-sm text-brand-200 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-8 items-center text-sm text-brand-200 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="mb-4 font-sans text-sm font-semibold text-white">Programs</h2>
            <ul className="space-y-2.5 text-sm text-brand-200">
              {PROGRAMS.map((p) => (
                <li key={p}>
                  <Link href="/programs" className="hover:text-white">{p}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-4 font-sans text-sm font-semibold text-white">Connect</h2>
            <div className="mb-5 flex gap-3">
              {SITE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-900 text-brand-100 transition-colors hover:bg-white hover:text-brand-900"
                >
                  <SocialIcon label={s.label} />
                </a>
              ))}
            </div>
            <a href={`mailto:${SITE.email}`} className="break-all text-sm text-brand-200 hover:text-white">
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-brand-900 pt-8 text-sm text-brand-300">
          <p>
            &copy; {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
            {SITE.registration && <> Registration no. {SITE.registration}.</>}
          </p>
          <Link href="/privacy" className="inline-flex min-h-8 items-center hover:text-white">Privacy policy</Link>
        </div>
      </div>
    </footer>
  );
};
