import { CheckCircle2, Clock, XCircle, PauseCircle, Circle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

const styles: Record<string, { cls: string; Icon: LucideIcon }> = {
  pending: { cls: 'bg-amber-50 text-amber-900', Icon: Clock },
  reviewed: { cls: 'bg-sky-50 text-sky-900', Icon: Circle },
  accepted: { cls: 'bg-brand-50 text-brand-800', Icon: CheckCircle2 },
  approved: { cls: 'bg-brand-50 text-brand-800', Icon: CheckCircle2 },
  active: { cls: 'bg-brand-50 text-brand-800', Icon: CheckCircle2 },
  completed: { cls: 'bg-teal-50 text-teal-900', Icon: CheckCircle2 },
  rejected: { cls: 'bg-red-50 text-red-800', Icon: XCircle },
  'on-hold': { cls: 'bg-stone-100 text-stone-700', Icon: PauseCircle },
  paused: { cls: 'bg-stone-100 text-stone-700', Icon: PauseCircle },
};

/** Status is always shown as icon plus text, never colour alone. */
export default function StatusBadge({ status }: StatusBadgeProps) {
  const { cls, Icon } = styles[status] ?? { cls: 'bg-stone-100 text-stone-700', Icon: Circle };
  const label = status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      <Icon size={14} aria-hidden="true" />
      {label}
    </span>
  );
}
