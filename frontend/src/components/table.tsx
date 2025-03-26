// /components/ui/table.tsx
import React from 'react';

export const Table = ({ children }: { children: React.ReactNode }) => {
  return <table className="min-w-full table-auto">{children}</table>;
};

export const TableHeader = ({ children }: { children: React.ReactNode }) => {
  return <thead className="bg-gray-100">{children}</thead>;
};

export const TableRow = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  return <tr onClick={onClick} className="hover:bg-gray-50">{children}</tr>;
};

export const TableHead = ({ children }: { children: React.ReactNode }) => {
  return <th className="px-4 py-2 text-left">{children}</th>;
};

export const TableBody = ({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>;
};

export const TableCell = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>;
};
