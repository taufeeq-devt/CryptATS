// /components/ui/button.tsx
import React from 'react';

export const Button = ({
  variant,
  size,
  children,
  onClick,
}: {
  variant: 'destructive' | 'default';
  size: 'sm' | 'lg';
  children: React.ReactNode;
  onClick: () => void;
}) => {
  const buttonClass = variant === 'destructive'
    ? 'bg-red-500 text-white hover:bg-red-600'
    : 'bg-blue-500 text-white hover:bg-blue-600';

  const sizeClass = size === 'sm' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-lg';

  return (
    <button
      className={`${buttonClass} ${sizeClass} rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
