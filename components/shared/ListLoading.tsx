import { CardGridSkeleton } from '@/components/ui/Skeleton';
import Skeleton from '@/components/ui/Skeleton';

/** Shared route-level loading state for pages that fetch on the server. */
export default function ListLoading() {
  return (
    <div className="px-5 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-4 h-10 w-2/3 max-w-lg" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        <div className="mt-12">
          <CardGridSkeleton />
        </div>
      </div>
    </div>
  );
}
