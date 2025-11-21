'use client';
import React, { useState } from 'react';
import { Menu, X, Facebook, Instagram, Linkedin, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const pathname = usePathname();

  // All hooks must be called unconditionally at the top
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  // Early return AFTER all hooks are called
  if (
    pathname === '/admin/' ||
    pathname.startsWith('/admin/') ||
    pathname === '/account' ||
    pathname.startsWith('/dashboard/')
  ) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-stone-200/80 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between">
          <Link href='/' className="flex items-center gap-2.5">
            <Image
              src='/images/agriformation.png'
              alt='logo'
              width={70}
              height={50}
              className='w-30 h-full object-cover'
            />
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            <Link href='/'
              className={`px-4 py-2 text-sm font-medium transition-colors ${currentPath === '/' ? 'text-green-800' : 'text-stone-600 hover:text-stone-900'}`}
            >
              Home
            </Link>
            <Link href='/about'
              className={`px-4 py-2 text-sm font-medium transition-colors ${currentPath === '/about' ? 'text-green-800' : 'text-stone-600 hover:text-stone-900'}`}
            >
              About
            </Link>
            <Link href='/programs'
              className={`px-4 py-2 text-sm font-medium transition-colors ${currentPath === '/programs' ? 'text-green-800' : 'text-stone-600 hover:text-stone-900'}`}
            >
              Programs
            </Link>
            <Link href='/gallery'
              className={`px-4 py-2 text-sm font-medium transition-colors ${currentPath === '/gallery' ? 'text-green-800' : 'text-stone-600 hover:text-stone-900'}`}
            >
              Gallery
            </Link>
            <Link href='/contact'
              className={`px-4 py-2 text-sm font-medium transition-colors ${currentPath === '/contact' ? 'text-green-800' : 'text-stone-600 hover:text-stone-900'}`}
            >
              Contact
            </Link>
            <Link href='/volunteer'
              className="ml-2 px-5 py-2 bg-green-700 text-white text-sm font-medium rounded hover:bg-green-900 transition-colors"
            >
              Get Involved
            </Link>
          </div>

          <button 
            className="md:hidden p-2 hover:bg-stone-100 rounded transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b border-stone-200 shadow-lg">
            <div className="px-5 py-6 space-y-1">
              {/* Mobile menu items... */}
              <Link href='/' onClick={() => setMobileMenuOpen(false)} className={`...`}>Home {currentPath === '/' && <ChevronRight size={18} />}</Link>
              {/* ... other links ... */}

              <div className="pt-6">
                <Link href='/volunteer' onClick={() => setMobileMenuOpen(false)} className="w-full px-5 py-4 bg-green-800 text-white font-semibold rounded text-center hover:bg-green-900 transition-colors shadow-sm">
                  Get Involved
                </Link>
              </div>

              <div className="pt-8 mt-8 border-t border-stone-200">
                <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-4">Connect With Us</p>
                <div className="flex gap-3">
                  <a href="https://www.facebook.com/profile.php?id=61560490960753" target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-stone-100 rounded flex items-center justify-center hover:bg-green-800 hover:text-white transition-colors">
                    <Facebook size={18} strokeWidth={2} />
                  </a>
                  <a href="https://www.instagram.com/agriformation_initiative" target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-stone-100 rounded flex items-center justify-center hover:bg-green-800 hover:text-white transition-colors">
                    <Instagram size={18} strokeWidth={2} />
                  </a>
                  <a href="https://www.linkedin.com/company/agriformation-initiative/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-stone-100 rounded flex items-center justify-center hover:bg-green-800 hover:text-white transition-colors">
                    <Linkedin size={18} strokeWidth={2} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};