import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Error 404</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">We can&apos;t find that page</h1>
        <p className="mt-4 text-lg text-stone-600">
          The link may be old or mistyped. Try the home page, or browse our programs.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/programs" variant="secondary">See programs</Button>
        </div>
      </div>
    </div>
  );
}
