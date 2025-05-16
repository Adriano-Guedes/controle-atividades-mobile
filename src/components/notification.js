// Notification.js
import React from "react";
import { ToastContainer, toast, Slide, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Componente de container
export function NotificationContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Slide}
    />
  );
}

export const notifyInfo = (msg) =>
  toast.info(msg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Slide,
  });

export const notifySuccess = (msg) =>
  toast.success(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Bounce,
  });

export const notifyWarning = (msg) =>
  toast.warn(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Bounce,
  });

export const notifyError = (msg) =>
  toast.error(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Bounce,
  });
