'use client';
import { useLayoutEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** Final value as written, such as "83" or "500+". Digits are counted up, the rest is kept. */
  value: string;
  durationMs?: number;
  className?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts from 0 to the value once it scrolls into view. The server renders the final value,
 * so the page is correct without JavaScript. Reduced-motion users just see the final value.
 */
export default function CountUp({ value, durationMs = 1600, className }: CountUpProps) {
  const match = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  const prefix = match?.[1] ?? '';
  const target = match ? parseInt(match[2].replace(/,/g, ''), 10) : 0;
  const suffix = match?.[3] ?? '';

  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(target);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !match || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setCurrent(0);
    let frame = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / durationMs, 1);
        setCurrent(Math.round(target * easeOutCubic(t)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // match is derived from value, so value and target cover it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs, target]);

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the final number once, not every step of the count */}
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="tabular-nums">
        {prefix}
        {current.toLocaleString('en-NG')}
        {suffix}
      </span>
    </span>
  );
}
