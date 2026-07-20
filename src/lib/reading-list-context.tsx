"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import toast from "react-hot-toast";

export interface ReadingListItem {
  _id: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  category: string;
  addedAt: string;
}

interface ReadingListContextValue {
  items: ReadingListItem[];
  loading: boolean;
  fetchReadingList: (userId: string) => Promise<void>;
  addToReadingList: (item: Omit<ReadingListItem, "_id" | "addedAt">) => Promise<boolean>;
  removeFromReadingList: (bookId: string) => Promise<void>;
  isInReadingList: (bookId: string) => boolean;
}

const ReadingListContext = createContext<ReadingListContextValue>({
  items: [],
  loading: false,
  fetchReadingList: async () => {},
  addToReadingList: async () => false,
  removeFromReadingList: async () => {},
  isInReadingList: () => false,
});

export function useReadingList() {
  return useContext(ReadingListContext);
}

export function ReadingListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ReadingListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReadingList = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reading-list?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching reading list:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToReadingList = useCallback(async (item: Omit<ReadingListItem, "_id" | "addedAt">) => {
    try {
      const res = await fetch("/api/reading-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const newItem = await res.json();
        setItems((prev) => [newItem, ...prev]);
        toast.success(`"${item.bookTitle}" added to reading list`);
        return true;
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add to reading list");
        return false;
      }
    } catch (error) {
      console.error("Error adding to reading list:", error);
      toast.error("Failed to add to reading list");
      return false;
    }
  }, []);

  const removeFromReadingList = useCallback(async (bookId: string) => {
    try {
      const res = await fetch(`/api/reading-list?bookId=${bookId}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.bookId !== bookId));
        toast.success("Removed from reading list");
      }
    } catch (error) {
      console.error("Error removing from reading list:", error);
      toast.error("Failed to remove from reading list");
    }
  }, []);

  const isInReadingList = useCallback((bookId: string) => {
    return items.some((item) => item.bookId === bookId);
  }, [items]);

  return (
    <ReadingListContext.Provider
      value={{ items, loading, fetchReadingList, addToReadingList, removeFromReadingList, isInReadingList }}
    >
      {children}
    </ReadingListContext.Provider>
  );
}
