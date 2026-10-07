import { Facebook, Instagram, Linkedin } from 'lucide-react';

const ICONS = { Facebook, Instagram, Linkedin } as const;

export default function SocialIcon({ label }: { label: string }) {
  const Icon = ICONS[label as keyof typeof ICONS];
  return Icon ? <Icon size={18} aria-hidden="true" /> : null;
}
