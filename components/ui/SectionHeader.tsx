// components/ui/SectionHeader.tsx
interface SectionHeaderProps {
  tag: string;
  title: string;
  description: string;
  className?: string;
}

export default function SectionHeader({ 
  tag, 
  title, 
  description, 
  className = '' 
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <span className="inline-block px-6 py-2 bg-green-600/10 text-green-700 rounded-full text-sm font-semibold mb-4">
        {tag}
      </span>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        {title}
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}