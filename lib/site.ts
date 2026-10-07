export const SITE = {
  name: 'AgroNext',
  fullName: 'AgroNext Agricultural Development Initiative',
  tagline: 'Transforming agricultural education in Nigeria',
  email: 'theagriformation.project@gmail.com',
  socials: [
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61560490960753' },
    { label: 'Instagram', href: 'https://www.instagram.com/agriformation_initiative' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/agriformation-initiative/' },
  ],
} as const;

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
