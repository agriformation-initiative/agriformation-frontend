'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
  Home,
  User,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'volunteer' | 'admin' | 'superadmin';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth, initAuth } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    initAuth();
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, router, initAuth]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    clearAuth();
    router.push('/auth');
  };

  if (!isAuthenticated || !user) return null;

  const navItems =
    role === 'volunteer'
      ? [
          { name: 'Dashboard', href: '/volunteer/dashboard', icon: Home },
          { name: 'My Profile', href: '/volunteer/profile', icon: User },
        ]
      : [
          { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
          { name: 'Applications', href: '/admin/applications', icon: FileText },
          { name: 'Volunteers', href: '/admin/volunteers', icon: Users },
          { name: 'Gallery', href: '/admin/gallery', icon: User },
          { name: 'Volunteer Calls', href: '/admin/volunteer-calls', icon: Users },
          ...(user.role === 'superadmin'
            ? [{ name: 'System Users', href: '/admin/users', icon: Settings }]
            : []),
        ];

  const roleDisplay = {
    volunteer: 'Volunteer',
    admin: 'Administrator',
    superadmin: 'Super Admin',
  }[role];

  return (
    <div className="min-h-screen bg-stone-50 flex relative">
      {/* Hamburger Button - Always visible */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-[60] p-2.5 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow border border-stone-200"
        aria-label="Toggle menu"
      >
        <Menu size={22} className="text-stone-700" />
      </button>

      {/* Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Image src="/images/agriformation.png" alt="Logo" width={80} height={80} />
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-stone-100 rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X size={22} className="text-stone-600" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-5 pt-4 pb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-700"></span>
            {roleDisplay}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-md transition-colors ${
                  isActive
                    ? 'bg-green-700 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-5 border-t border-stone-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-green-700 rounded-full flex items-center justify-center text-white font-semibold">
              {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-900 truncate text-sm">{user.fullName}</p>
              <p className="text-xs text-stone-500 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-100 text-stone-700 rounded-md font-medium hover:bg-stone-200 transition-colors"
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 w-full">
        <main className={`min-h-screen p-6 md:p-10 transition-all duration-300 ${
          isSidebarOpen ? 'blur-sm' : ''
        }`}>
          <div className="pt-14">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}