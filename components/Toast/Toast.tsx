// components/Toast.tsx

import React, { useEffect, useState } from "react";
import styles from "./Toast.module.scss";

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  duration = 2000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return <div className={styles.toast}>{message}</div>;
}
