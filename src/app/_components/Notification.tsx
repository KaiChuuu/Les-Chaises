"use client";
import { useEffect } from "react";

interface NotificationProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function Notification({
  message,
  show,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // hides after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed top-25 left-1/2 transform -translate-x-1/2 px-6 py-3 shadow-lg text-md font-medium tracking-wide text-wide transition-opacity duration-300 ${
        show ? "opacity-100 bg-neutral-800" : "opacity-0 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
}
