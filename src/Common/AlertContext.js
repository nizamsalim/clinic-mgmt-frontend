import { createContext, useContext, useState } from "react";
import { AlertData } from "./Constants";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(AlertData);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const showAlert = (message, type = "danger") => {
    setAlert({
      message,
      type,
    });
    setIsAlertVisible(true);
    setTimeout(() => {
      setIsAlertVisible(false);
    }, 2000);
  };

  return (
    <AlertContext.Provider value={{ alert, isAlertVisible, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
