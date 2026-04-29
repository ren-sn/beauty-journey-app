import React, { createContext, useContext, useState, useCallback } from 'react';
import ButterflyAlert from '../components/ButterflyAlert';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    isVisible: false,
    message: '',
  });

  const showAlert = useCallback((message) => {
    setAlertState({
      isVisible: true,
      message,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState({
      isVisible: false,
      message: '',
    });
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <ButterflyAlert
        message={alertState.message}
        isVisible={alertState.isVisible}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
};
