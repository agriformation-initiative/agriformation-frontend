// components/ui/StatCard.tsx
interface StatCardProps {
  number: string;
  label: string;
}

export default function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="bg-white text-center p-12 rounded-2xl border border-green-600/10 hover:translate-y-[-10px] hover:shadow-xl hover:shadow-green-600/10 transition-all duration-300">
      <div className="text-5xl font-bold text-green-700 mb-2">
        {number}
      </div>
      <div className="text-xl font-semibold text-gray-800">
        {label}
      </div>
    </div>
  );
}