"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { usePathname } from "next/navigation";

export interface Notification {
  _id: string;
  type: "delivery_request" | "delivery_update" | "book_approved" | "book_rejected" | "review";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: (userId: string, role: string) => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  fetchNotifications: async () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotification: () => {},
  clearAll: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Auto-detect role from pathname
  const role = pathname.includes("/dashboard/admin")
    ? "admin"
    : pathname.includes("/dashboard/librarian")
    ? "librarian"
    : "reader";

  const fetchNotifications = useCallback(async (userId: string, role: string) => {
    setLoading(true);
    try {
      // Fetch deliveries as notifications based on role
      let url = "/api/deliveries";
      if (role === "reader") {
        url += `?userId=${userId}`;
      }

      const res = await fetch(url);
      if (!res.ok) return;

      const deliveries = await res.json();

      // Filter out old anonymous entries
      const validDeliveries = Array.isArray(deliveries)
        ? deliveries.filter((d: any) => d.userId && d.userId !== "anonymous")
        : [];

      const notifs: Notification[] = validDeliveries.map((d: any) => {
        const isOwn = d.userId === userId;
        let type: Notification["type"] = "delivery_request";
        let title = "";
        let message = "";

        if (role === "librarian" || role === "admin") {
          // Librarian/Admin sees incoming requests
          if (d.status === "Pending") {
            type = "delivery_request";
            title = "New Delivery Request";
            message = `${d.userName || "A user"} requested "${d.bookTitle}"`;
          } else if (d.status === "Dispatched") {
            type = "delivery_update";
            title = "Delivery Dispatched";
            message = `"${d.bookTitle}" has been dispatched to ${d.userName || "the user"}`;
          } else if (d.status === "Delivered") {
            type = "delivery_update";
            title = "Delivery Completed";
            message = `"${d.bookTitle}" was delivered to ${d.userName || "the user"}`;
          }
        } else {
          // Reader sees their own delivery updates
          if (d.status === "Pending") {
            type = "delivery_request";
            title = "Delivery Requested";
            message = `Your request for "${d.bookTitle}" is pending`;
          } else if (d.status === "Dispatched") {
            type = "delivery_update";
            title = "Book Dispatched";
            message = `"${d.bookTitle}" is on its way to you!`;
          } else if (d.status === "Delivered") {
            type = "delivery_update";
            title = "Book Delivered";
            message = `"${d.bookTitle}" has been delivered. Enjoy reading!`;
          }
        }

        return {
          _id: d._id,
          type,
          title,
          message,
          read: false,
          createdAt: d.updatedAt || d.requestDate || d.createdAt || new Date().toISOString(),
          link: `/books/${d.bookId}`,
        };
      });

      // Sort by date, newest first
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setNotifications(notifs);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch notifications when session loads (handles page refresh)
  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications(session.user.id, role);
    }
  }, [session?.user?.id, role, fetchNotifications]);

  // Auto-refresh notifications (10s for librarian/admin, 30s for reader)
  useEffect(() => {
    if (!session?.user?.id) return;
    const intervalMs = (role === "librarian" || role === "admin") ? 10000 : 30000;
    const interval = setInterval(() => {
      fetchNotifications(session.user.id, role);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [session?.user?.id, role, fetchNotifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
