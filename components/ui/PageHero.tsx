import Image from 'next/image';
import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  image?: { src: string; alt: string };
  priority?: boolean;
  children?: ReactNode;
}

/** Page opener: text left, optional photo right. The photo is hidden below lg to keep mobile light. */
export default function PageHero({ eyebrow, title, description, image, priority, children }: PageHeroProps) {
  return (
    <section className="bg-brand-50 px-5 py-16 md:px-8 md:py-24">
      <div className={`mx-auto grid max-w-6xl items-center gap-12 ${image ? 'lg:grid-cols-2 lg:gap-16' : ''}`}>
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-700">{eyebrow}</p>
          <h1 className="text-4xl font-semibold md:text-5xl">{title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">{description}</p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {image && (
          <div className="relative hidden aspect-4/5 overflow-hidden rounded-xl bg-stone-200 lg:block">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 560px, 0px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
