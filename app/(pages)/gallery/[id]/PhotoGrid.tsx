'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Photo } from '@/types/indexes';

export default function PhotoGrid({ photos, title }: { photos: Photo[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIndex(null);
    opener.current?.focus(); // return focus to the photo that opened the viewer
  }, []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (index === null) return;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, close, step]);

  const current = index === null ? null : photos[index];
  const navBtn =
    'flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30';

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, i) => (
          <li key={photo._id}>
            <button
              type="button"
              onClick={(e) => { opener.current = e.currentTarget; setIndex(i); }}
              className="group relative block aspect-4/3 w-full overflow-hidden rounded-xl bg-stone-200"
              aria-label={`View photo ${i + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ''}`}
            >
              <Image
                src={photo.url}
                alt={photo.caption || `${title}, photo ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
            {photo.caption && <p className="mt-2 text-sm text-stone-600">{photo.caption}</p>}
          </li>
        ))}
      </ul>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title}, photo ${(index ?? 0) + 1} of ${photos.length}`}
          className="fixed inset-0 z-70 flex flex-col bg-stone-950 text-white"
        >
          <div className="flex items-center justify-between p-4">
            <p className="text-sm tabular-nums">{(index ?? 0) + 1} / {photos.length}</p>
            <button ref={closeRef} type="button" onClick={close} aria-label="Close viewer" className={navBtn}>
              <X size={24} />
            </button>
          </div>
          <div className="relative flex-1">
            <Image
              key={current._id}
              src={current.url}
              alt={current.caption || `${title}, photo ${(index ?? 0) + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className={navBtn}>
              <ChevronLeft size={26} />
            </button>
            <p className="text-center text-base">{current.caption}</p>
            <button type="button" onClick={() => step(1)} aria-label="Next photo" className={navBtn}>
              <ChevronRight size={26} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
