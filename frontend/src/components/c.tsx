// /components/ui/card.tsx
import React from 'react';

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={`p-4 border rounded-lg shadow-md ${className}`}>{children}</div>;
};

export const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4">{children}</div>;
};
