"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import toast from "react-hot-toast";

export interface Delivery {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  deliveryFee: number;
  status: "Pending" | "Dispatched" | "Delivered";
  paymentStatus?: string;
  category?: string;
  requestDate: string;
  createdAt?: string;
  updatedAt: string;
}

interface DeliveryContextValue {
  deliveries: Delivery[];
  loading: boolean;
  fetchDeliveries: (userId?: string) => Promise<void>;
  addDelivery: (delivery: Delivery) => void;
  updateDeliveryStatus: (id: string, status: Delivery["status"]) => Promise<void>;
  hasExistingDelivery: (bookId: string) => Delivery | null;
}

const DeliveryContext = createContext<DeliveryContextValue>({
  deliveries: [],
  loading: false,
  fetchDeliveries: async () => {},
  addDelivery: () => {},
  updateDeliveryStatus: async () => {},
  hasExistingDelivery: () => null,
});

export function useDeliveries() {
  return useContext(DeliveryContext);
}

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDeliveries = useCallback(async (userId?: string) => {
    setLoading(true);
    try {
      const url = userId
        ? `/api/deliveries?userId=${userId}`
        : "/api/deliveries";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const filtered = Array.isArray(data) ? data : [];
        setDeliveries(filtered);
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDelivery = useCallback((delivery: Delivery) => {
    setDeliveries((prev) => [delivery, ...prev]);
  }, []);

  const hasExistingDelivery = useCallback(
    (bookId: string): Delivery | null => {
      return (
        deliveries.find(
          (d) =>
            d.bookId === bookId &&
            (d.status === "Pending" || d.status === "Dispatched" || d.status === "Delivered")
        ) || null
      );
    },
    [deliveries]
  );

  const updateDeliveryStatus = useCallback(
    async (id: string, status: Delivery["status"]) => {
      console.log(`[DeliveryContext] Updating delivery ${id} to ${status}`);
      const res = await fetch("/api/deliveries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryId: id, status }),
      });

      const data = await res.json();
      console.log(`[DeliveryContext] PATCH response:`, res.status, data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to update delivery status");
      }

      setDeliveries((prev) =>
        prev.map((d) =>
          d._id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d
        )
      );
      console.log(`[DeliveryContext] Local state updated for delivery ${id}`);
    },
    []
  );

  return (
    <DeliveryContext.Provider
      value={{ deliveries, loading, fetchDeliveries, addDelivery, updateDeliveryStatus, hasExistingDelivery }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}
