// app/layout.tsx
import { ReactNode } from 'react';
import { Inter, Poppins } from 'next/font/google';
import { Navigation } from '@/components/shared/Navbar';
import {Footer} from '@/components/shared/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

// const quicksand = Quicksand({ 
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
// });

export const metadata = {
  title: 'AgriVision Nigeria - Transforming Young Minds, Growing Future Leaders',
  description: 'Empowering young minds to see agriculture not as a last resort, but as a pathway to innovation, prosperity, and sustainable impact.',
}

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} $`}>
      <body className="font-inter antialiased">
        <Navigation/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}