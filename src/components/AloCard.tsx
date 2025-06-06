import React from 'react';

interface AloCardProps {
  className?: string;
  children: React.ReactNode;
}

export default function AloCard({ className = '', children }: AloCardProps) {
  return (
    <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl ${className}`}>
      {children}
    </div>
  );
}
