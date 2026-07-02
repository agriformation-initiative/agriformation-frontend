interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-800 border border-amber-200',
  reviewed: 'bg-blue-50 text-blue-800 border border-blue-200',
  accepted: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  active: 'bg-green-50 text-green-800 border border-green-200',
  completed: 'bg-teal-50 text-teal-800 border border-teal-200',
  rejected: 'bg-red-50 text-red-800 border border-red-200',
  'on-hold': 'bg-stone-100 text-stone-700 border border-stone-200',
  paused: 'bg-stone-100 text-stone-700 border border-stone-200',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] ?? 'bg-gray-100 text-gray-700 border border-gray-200';
  const label = status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
