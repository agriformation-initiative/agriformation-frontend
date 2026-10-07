import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { Navigation } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
});

export const metadata: Metadata = {
  title: {
    default: 'AgroNext Agricultural Development Initiative',
    template: '%s | AgroNext',
  },
  description:
    'AgroNext helps young Nigerians see agriculture as a path to innovation, prosperity and sustainable impact, through school gardens, farm excursions and mentorship.',
};

export const viewport: Viewport = {
  themeColor: '#2d5e29',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-brand-800 focus:shadow-raised"
        >
          Skip to content
        </a>
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
