"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/profile") || pathname.startsWith("/settings");

  return (
    <>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--rr-surface)",
            color: "var(--rr-ink)",
            border: "1px solid var(--rr-hairline)",
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            padding: "12px 16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          },
          success: {
            duration: 3000,
            style: {
              borderLeft: "3px solid #3d7a38",
            },
          },
          error: {
            duration: 5000,
            style: {
              borderLeft: "3px solid #9e3b2e",
            },
          },
        }}
      />
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}
