import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import Skeleton from '@/components/ui/Skeleton';

/** Heading row used at the top of every dashboard screen. One primary action at most. */
export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {description && <p className="mt-1 text-stone-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatTile({ icon: Icon, label, value, href }: { icon: LucideIcon; label: string; value: ReactNode; href?: string }) {
  const body = (
    <>
      <Icon size={22} className="text-brand-700" aria-hidden="true" />
      <p className="mt-4 font-display text-3xl font-semibold tabular-nums text-stone-900">{value}</p>
      <p className="text-sm text-stone-600">{label}</p>
    </>
  );
  const cls = 'block rounded-xl bg-white p-5';
  return href ? (
    <Link href={href} className={`${cls} transition-shadow hover:shadow-raised`}>{body}</Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="px-6 py-14 text-center">
      <Icon size={36} className="mx-auto text-stone-400" aria-hidden="true" />
      <p className="mt-3 text-lg font-medium text-stone-800">{title}</p>
      {description && <p className="mt-1 text-stone-600">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-xl bg-red-50 p-6 text-red-900">
      <p className="font-medium">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-3 min-h-11 font-semibold underline underline-offset-4">
          Try again
        </button>
      )}
    </div>
  );
}

/** Skeleton shaped like a page header, a row of stat tiles and a list panel. */
export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
      <Skeleton className="mt-8 h-72 rounded-xl" />
    </div>
  );
}
