import type { ReactNode } from 'react';

/** A wide table scrolls inside its own container, never the page. */
export function Table({ children, caption }: { children: ReactNode; caption: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-2xl text-left">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <th scope="col" className={`bg-stone-50 px-6 py-3 text-sm font-semibold text-stone-700 ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <td className={`px-6 py-4 align-middle text-stone-700 ${className}`}>{children}</td>;
}

export const rowClass = 'border-t border-stone-200 hover:bg-stone-50';
