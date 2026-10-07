'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import SocialIcon from '@/components/shared/SocialIcon';
import { NAV_LINKS, SITE, isActivePath, isAppShellPath } from '@/lib/site';
import Image from "next/image"

export const Navigation = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu on navigation and on Escape; lock page scroll while it is open
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (isAppShellPath(pathname)) return null;

  const linkClass = (href: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActivePath(pathname, href) ? 'text-brand-800' : 'text-stone-600 hover:text-stone-900'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Image src="/images/agronext.png" alt="Logo" width={100} height={40} />

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
              className={linkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}
          <Button href="/volunteer" className="ml-3 !min-h-10 !py-2 text-sm">Volunteer with us</Button>
        </div>

        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-md text-stone-700 hover:bg-stone-100 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full max-h-dvh overflow-y-auto border-b border-stone-200 bg-white shadow-overlay lg:hidden"
        >
          <div className="mx-auto max-w-6xl px-5 pb-8 pt-2 md:px-8">
            <ul>
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
                    className={`flex min-h-12 items-center border-b border-stone-100 text-lg ${
                      isActivePath(pathname, item.href) ? 'font-semibold text-brand-800' : 'text-stone-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button href="/volunteer" fullWidth className="mt-6">Volunteer with us</Button>
            <div className="mt-6 flex gap-3">
              {SITE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-md bg-stone-100 text-stone-700 hover:bg-brand-700 hover:text-white"
                >
                  <SocialIcon label={s.label} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
