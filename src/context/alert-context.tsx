'use client'

// lib/AlertContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the alert type
type AlertType = 'success' | 'error' | 'warning' | 'info';

// Define the alert context shape
interface Alert {
  message: string;
  type: AlertType;
}

interface AlertContextType {
  alert: Alert | null;
  showAlert: (message: string, type: AlertType) => void;
  hideAlert: () => void;
}

// Create the context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Custom hook to use the context
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

// Alert Provider component
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = (message: string, type: AlertType) => {
    setAlert({ message, type });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};