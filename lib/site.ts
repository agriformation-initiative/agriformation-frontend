export const SITE = {
  name: 'AgroNext',
  fullName: 'AgroNext Agricultural Development Initiative',
  tagline: 'Transforming agricultural education in Nigeria',
  // Set NEXT_PUBLIC_CONTACT_EMAIL to your Zoho address when it is ready
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'theagriformation.project@gmail.com',
  /** Shown in the footer and on the transparency page only when set (for example your CAC number). */
  registration: process.env.NEXT_PUBLIC_REGISTRATION_NUMBER || '',
  /** Shown on the donate page only when all three are set. */
  bank: {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || '',
    accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || '',
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || '',
  },
  socials: [
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61560490960753' },
    { label: 'Instagram', href: 'https://www.instagram.com/agriformation_initiative' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/agriformation-initiative/' },
  ],
} as const;

/** Organisations we have worked with. Add real partners here and they appear on the transparency page. */
export const PARTNERS = [
  { name: 'Ibiteinye Inye Integrated Farms', role: 'Host of the 2024 pilot farm excursion' },
];

/** Extra footer links beyond the main navigation. */
export const FOOTER_LINKS = [
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'For schools', href: '/schools' },
  { label: 'Partner with us', href: '/partner' },
  { label: 'Donate', href: '/donate' },
  { label: 'Transparency', href: '/transparency' },
] as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;

/** Routes that render inside the dashboard shell and so hide the public navbar and footer. */
const APP_SHELL_PREFIXES = ['/admin', '/dashboard', '/volunteer/dashboard', '/volunteer/profile'];

export const isAppShellPath = (pathname: string) =>
  APP_SHELL_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

export const isActivePath = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
