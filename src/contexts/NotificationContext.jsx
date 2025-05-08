// src/contexts/NotificationContext.jsx
import React, { createContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

export const NotificationContext = createContext({
  notify: (msg, severity) => {},
});

export function NotificationProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    severity: "success",
  });

  const notify = useCallback((message, severity = "success") => {
    setNotification({ message, severity });
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
