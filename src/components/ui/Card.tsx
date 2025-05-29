import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  onClick,
  hoverable = false
}) => {
  const baseStyles = `
    bg-white 
    rounded-lg 
    shadow-md 
    overflow-hidden
  `;
  
  const hoverStyles = hoverable 
    ? 'transition-transform duration-200 hover:shadow-lg hover:-translate-y-1' 
    : '';
  
  const clickStyles = onClick 
    ? 'cursor-pointer' 
    : '';
  
  return (
    <div 
      className={`
        ${baseStyles} 
        ${hoverStyles} 
        ${clickStyles} 
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

export default Card;