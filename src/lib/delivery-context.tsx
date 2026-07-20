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
  requestDate: string;
  updatedAt: string;
}

interface DeliveryContextValue {
  deliveries: Delivery[];
  loading: boolean;
  fetchDeliveries: (userId?: string) => Promise<void>;
  addDelivery: (delivery: Delivery) => void;
  updateDeliveryStatus: (id: string, status: Delivery["status"]) => Promise<void>;
}

const DeliveryContext = createContext<DeliveryContextValue>({
  deliveries: [],
  loading: false,
  fetchDeliveries: async () => {},
  addDelivery: () => {},
  updateDeliveryStatus: async () => {},
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
        setDeliveries(data);
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

  const updateDeliveryStatus = useCallback(
    async (id: string, status: Delivery["status"]) => {
      try {
        const res = await fetch("/api/deliveries", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deliveryId: id, status }),
        });

        if (res.ok) {
          setDeliveries((prev) =>
            prev.map((d) =>
              d._id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d
            )
          );
        }
      } catch (error) {
        console.error("Error updating delivery:", error);
      }
    },
    []
  );

  return (
    <DeliveryContext.Provider
      value={{ deliveries, loading, fetchDeliveries, addDelivery, updateDeliveryStatus }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}
