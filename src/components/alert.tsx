'use client'

// components/Alert.tsx
import React from 'react';
import { useAlert } from '@/context/alert-context';

const Alert: React.FC = () => {
  const { alert, hideAlert } = useAlert();

  if (!alert) return null;

  const { message, type } = alert;

  // Define styles based on alert type
  const alertStyles: Record<string, string> = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${alertStyles[type]} flex items-center justify-between max-w-sm`}
    >
      <span>{message}</span>
      <button
        onClick={hideAlert}
        className="ml-4 text-white font-bold"
      >
        ✕
      </button>
    </div>
  );
};

export default Alert;