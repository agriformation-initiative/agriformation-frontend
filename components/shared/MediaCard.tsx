import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface MediaCardProps {
  href: string;
  image?: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: ReactNode;
  footer?: ReactNode;
  muted?: boolean;
}

/** Whole-card link used for gallery albums, blog posts and volunteer opportunities. */
export default function MediaCard({
  href, image, imageAlt, eyebrow, title, description, badge, footer, muted,
}: MediaCardProps) {
  return (
    <Link
      href={href}
      className={`group flex h-full flex-col overflow-hidden rounded-xl bg-white transition-shadow duration-200 hover:shadow-raised ${muted ? 'opacity-75' : ''}`}
    >
      <div className="relative aspect-3/2 overflow-hidden bg-stone-200">
        {image && (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {badge && <div className="absolute left-3 top-3">{badge}</div>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {eyebrow && <p className="text-sm font-medium text-brand-700">{eyebrow}</p>}
        <h3 className="mt-1 line-clamp-2 text-xl font-semibold group-hover:text-brand-800">{title}</h3>
        {description && <p className="mt-2 line-clamp-2 text-stone-600">{description}</p>}
        {footer && <div className="mt-auto pt-4 text-sm text-stone-600">{footer}</div>}
      </div>
    </Link>
  );
}
