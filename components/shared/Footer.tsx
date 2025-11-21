'use client';
import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from "next/navigation";


export const Footer = () => {
  const navigateTo = (path: string) => {
    console.log(`Navigating to ${path}`);
    window.scrollTo(0, 0);
  };

  const pathname = usePathname();
  if (pathname === '/admin/' || pathname.startsWith('/admin/') || pathname === '/account' || pathname.startsWith('/dashboard/') ) {
    return null;
  }


  return (
    <footer className="bg-stone-900 text-stone-300 py-16 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-4">
            <button onClick={() => navigateTo('/')} className="flex items-center gap-2.5 mb-5">
              <Image
                src='/images/agriformation.png'
                alt='logo'
                width={70}
                height={50}
                className='w-44 h-full object-cover'
              />
            </button>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Transforming agricultural education in Nigeria through practical learning and community engagement.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Navigate</h4>
            <div className="space-y-2.5">
              <button onClick={() => navigateTo('/about')} className="block text-stone-400 hover:text-white transition text-sm">About Us</button>
              <button onClick={() => navigateTo('/programs')} className="block text-stone-400 hover:text-white transition text-sm">Our Programs</button>
              <button onClick={() => navigateTo('/gallery')} className="block text-stone-400 hover:text-white transition text-sm">Gallery</button>
              <button onClick={() => navigateTo('/volunteer')} className="block text-stone-400 hover:text-white transition text-sm">Volunteer</button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Programs</h4>
            <div className="space-y-2.5 text-sm text-stone-400">
              <p>School Gardens & Agri-Clubs</p>
              <p>Teacher Training</p>
              <p>Farm Excursions</p>
              <p>Summer Internships</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex gap-2.5 mb-5">
              <a 
                href="https://www.facebook.com/profile.php?id=61560490960753" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-stone-800 rounded flex items-center justify-center hover:bg-emerald-800 transition-colors"
              >
                <Facebook size={16} strokeWidth={2} />
              </a>
              <a 
                href="https://www.instagram.com/agriformation_initiative" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-stone-800 rounded flex items-center justify-center hover:bg-emerald-800 transition-colors"
              >
                <Instagram size={16} strokeWidth={2} />
              </a>
              <a 
                href="https://www.linkedin.com/company/agriformation-initiative/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-stone-800 rounded flex items-center justify-center hover:bg-emerald-800 transition-colors"
              >
                <Linkedin size={16} strokeWidth={2} />
              </a>
            </div>
            <a href="mailto:theagriformation.project@gmail.com" className="text-sm text-stone-400 hover:text-white transition block">
              theagriformation.project@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-stone-500">
          <p>&copy; 2025 Agriformation Initiative. All rights reserved.</p>
          <p className="text-xs">Transforming Agricultural Education in Nigeria</p>
        </div>
      </div>
    </footer>
  );
};
