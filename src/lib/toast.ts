import toast from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import React from "react";

const iconStyle = { display: "inline-flex", alignItems: "center", marginRight: "8px" };

export const toastSuccess = (message: string) =>
  toast.success(message, {
    icon: React.createElement(CheckCircle, { size: 18, style: iconStyle }),
  });

export const toastError = (message: string) =>
  toast.error(message, {
    icon: React.createElement(XCircle, { size: 18, style: iconStyle }),
    duration: 5000,
  });

export const toastInfo = (message: string) =>
  toast(message, {
    icon: React.createElement(Info, { size: 18, style: iconStyle }),
    style: {
      background: "var(--rr-surface)",
      color: "var(--rr-ink)",
      border: "1px solid var(--rr-slate)",
    },
  });

export const toastWarning = (message: string) =>
  toast(message, {
    icon: React.createElement(AlertTriangle, { size: 18, style: iconStyle }),
    style: {
      background: "var(--rr-surface)",
      color: "var(--rr-ink)",
      border: "1px solid var(--rr-gold)",
    },
  });

export const toastLoading = (message: string) =>
  toast.loading(message, {
    icon: React.createElement(Loader2, { size: 18, style: { ...iconStyle, animation: "spin 1s linear infinite" } }),
  });

export const toastDismiss = (id: string) => toast.dismiss(id);

export const toastPromise = <T,>(
  promise: Promise<T>,
  msgs: { loading: string; success: string; error: string }
) =>
  toast.promise(promise, msgs, {
    style: {
      background: "var(--rr-surface)",
      color: "var(--rr-ink)",
      border: "1px solid var(--rr-hairline)",
      borderRadius: "12px",
      fontSize: "14px",
    },
    success: {
      icon: React.createElement(CheckCircle, { size: 18, style: iconStyle }),
      duration: 3000,
    },
    error: {
      icon: React.createElement(XCircle, { size: 18, style: iconStyle }),
      duration: 5000,
    },
    loading: {
      icon: React.createElement(Loader2, { size: 18, style: { ...iconStyle, animation: "spin 1s linear infinite" } }),
    },
  });
