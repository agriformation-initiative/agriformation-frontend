'use client';
import Button from '@/components/ui/Button';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-semibold">Something went wrong</h1>
        <p className="mt-4 text-lg text-stone-600">
          The page could not be shown. Try again, and if it keeps happening, come back in a few minutes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button href="/" variant="secondary">Back to home</Button>
        </div>
      </div>
    </div>
  );
}
