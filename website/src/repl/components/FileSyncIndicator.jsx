import React from 'react';

export function FileSyncIndicator({ status }) {
  if (!status || !status.type) return null;

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }[status.type] || 'bg-gray-600';

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white text-sm font-mono ${bgColor} shadow-lg transition-opacity duration-300 z-50`}>
      {status.message}
    </div>
  );
}