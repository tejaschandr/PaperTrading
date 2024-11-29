import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;
  
  return (
    <div className="text-red-500 bg-red-50 p-4 rounded mb-4">
      {error}
    </div>
  );
}