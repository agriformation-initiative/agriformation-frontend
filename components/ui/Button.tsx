// components/ui/Button.tsx
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
  className?: string;
  onClick?: () => void;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  href, 
  className = '',
  onClick 
}: ButtonProps) {
  const baseStyles = 'px-10 py-4 rounded-full font-semibold transition-all duration-300 hover:translate-y-[-2px] inline-block text-center';
  
  const variants = {
    primary: 'bg-green-700 text-white hover:bg-green-800 hover:shadow-lg hover:shadow-green-600/30',
    secondary: 'bg-white text-green-700 border-2 border-green-700 hover:bg-gray-50',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClassName}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} onClick={onClick}>
      {children}
    </button>
  );
}