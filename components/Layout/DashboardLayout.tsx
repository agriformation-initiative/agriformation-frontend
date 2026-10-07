'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home, User, Users, FileText, Settings, LogOut, Menu, X, Images, Megaphone, BookOpen,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/components/ui/Logo';
import Skeleton from '@/components/ui/Skeleton';

interface DashboardLayoutProps {
  children: React.ReactNode;
  /** Which area this shell serves. Users of the other kind are sent to their own dashboard. */
  area: 'admin' | 'volunteer';
}

const VOLUNTEER_NAV = [
  { name: 'Dashboard', href: '/volunteer/dashboard', icon: Home },
  { name: 'My profile', href: '/volunteer/profile', icon: User },
];

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Volunteers', href: '/admin/volunteers', icon: Users },
  { name: 'Volunteer calls', href: '/admin/volunteer-calls', icon: Megaphone },
  { name: 'Gallery', href: '/admin/gallery', icon: Images },
  { name: 'Blog', href: '/admin/blog', icon: BookOpen },
];

const ROLE_LABEL = { volunteer: 'Volunteer', admin: 'Administrator', superadmin: 'Super admin' } as const;

export default function DashboardLayout({ children, area }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, hydrated, clearAuth, initAuth } = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => initAuth(), [initAuth]);

  const isAdminUser = user?.role === 'admin' || user?.role === 'superadmin';
  const allowed = isAuthenticated && (area === 'admin' ? isAdminUser : user?.role === 'volunteer');

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.replace('/auth');
    else if (!allowed) router.replace(isAdminUser ? '/admin/dashboard' : '/volunteer/dashboard');
  }, [hydrated, isAuthenticated, allowed, isAdminUser, router]);

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

  if (!hydrated || !allowed || !user) {
    return (
      <div className="min-h-screen p-8" role="status" aria-label="Loading your dashboard">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-6 h-40 w-full max-w-3xl" />
      </div>
    );
  }

  const navItems = [
    ...(area === 'admin' ? ADMIN_NAV : VOLUNTEER_NAV),
    ...(user.role === 'superadmin' ? [{ name: 'System users', href: '/admin/users', icon: Settings }] : []),
  ];
  const initials = user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const logout = () => {
    clearAuth();
    router.push('/auth');
  };

  return (
    <div className="flex min-h-screen">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-3 top-3 z-40 flex h-11 w-11 items-center justify-center rounded-md bg-white text-stone-700 shadow-raised md:hidden"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu size={22} />
      </button>

      {open && <div className="fixed inset-0 z-40 bg-stone-900/50 md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-stone-200 bg-white transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Dashboard"
      >
        <div className="flex items-center justify-between border-b border-stone-200 p-4">
          <Logo showTagline={false} />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-md text-stone-600 hover:bg-stone-100 md:hidden"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <p className="px-5 pb-1 pt-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
          {ROLE_LABEL[user.role]}
        </p>

        <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Dashboard sections">
          <ul className="space-y-1">
            {navItems.map(({ name, href, icon: Icon }) => {
              const active = pathname === href || (href !== '/admin/dashboard' && href !== '/volunteer/dashboard' && pathname.startsWith(`${href}/`));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-md px-3 font-medium transition-colors ${
                      active ? 'bg-brand-700 text-white' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Icon size={20} aria-hidden="true" />
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-stone-200 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800" aria-hidden="true">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-900">{user.fullName}</p>
              <p className="truncate text-sm text-stone-600">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-stone-100 font-medium text-stone-800 transition-colors hover:bg-stone-200"
          >
            <LogOut size={18} aria-hidden="true" /> Log out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-4 pb-10 pt-16 md:px-10 md:pt-10">{children}</div>
    </div>
  );
}
