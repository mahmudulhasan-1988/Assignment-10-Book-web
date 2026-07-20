// lib/librarian-data.ts
//
// Stand-in data layer for the librarian dashboard.

import type { BookStatus } from "@/types/admin";

// --- Constants ---

export const BOOK_STATUS = {
  PENDING: "pending_approval" as BookStatus,
  PUBLISHED: "published" as BookStatus,
  UNPUBLISHED: "unpublished" as BookStatus,
};

export const DELIVERY_STATUS = {
  PENDING: "Pending",
  DISPATCHED: "Dispatched",
  DELIVERED: "Delivered",
} as const;

export const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Sci-Fi & Fantasy",
  "Children's",
  "Biography",
  "Academic",
  "Poetry",
];

export const statusChipColor: Record<string, "warning" | "accent" | "success"> = {
  Pending: "warning",
  Dispatched: "accent",
  Delivered: "success",
  pending_approval: "warning",
  published: "success",
  unpublished: "accent",
};

// --- Mock data ---

export interface BookEntry {
  id: string;
  title: string;
  author: string;
  description: string;
  deliveryFee: number;
  category: string;
  imageUrl: string;
  status: BookStatus;
  requests: number;
}

export interface DeliveryEntry {
  id: string;
  clientName: string;
  bookTitle: string;
  date: string;
  status: "Pending" | "Dispatched" | "Delivered";
}

export const initialBooks: BookEntry[] = [
  {
    id: "bk_2001",
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "A novel about the many possible lives we could have lived.",
    deliveryFee: 3.5,
    category: "Fiction",
    imageUrl: "",
    status: "published",
    requests: 42,
  },
  {
    id: "bk_2002",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    description: "A story told from the perspective of an Artificial Friend.",
    deliveryFee: 3.5,
    category: "Fiction",
    imageUrl: "",
    status: "published",
    requests: 38,
  },
  {
    id: "bk_2003",
    title: "Educated",
    author: "Tara Westover",
    description: "A memoir about growing up in a survivalist family.",
    deliveryFee: 4.0,
    category: "Biography",
    imageUrl: "",
    status: "published",
    requests: 27,
  },
  {
    id: "bk_2004",
    title: "Piranesi",
    author: "Susanna Clarke",
    description: "A man explores an endless, labyrinthine house.",
    deliveryFee: 4.0,
    category: "Sci-Fi & Fantasy",
    imageUrl: "",
    status: "pending_approval",
    requests: 0,
  },
  {
    id: "bk_2005",
    title: "Circe",
    author: "Madeline Miller",
    description: "A bold and subversive retelling of the goddess Circe's story.",
    deliveryFee: 4.0,
    category: "Fiction",
    imageUrl: "",
    status: "unpublished",
    requests: 15,
  },
];

export const initialDeliveries: DeliveryEntry[] = [
  { id: "del_101", clientName: "Marcus Lee", bookTitle: "The Midnight Library", date: "2026-07-16T14:00:00Z", status: "Pending" },
  { id: "del_102", clientName: "Sofia Guzman", bookTitle: "Klara and the Sun", date: "2026-07-15T10:30:00Z", status: "Dispatched" },
  { id: "del_103", clientName: "Marcus Lee", bookTitle: "Educated", date: "2026-07-14T09:00:00Z", status: "Delivered" },
  { id: "del_104", clientName: "Sofia Guzman", bookTitle: "Circe", date: "2026-07-17T11:00:00Z", status: "Pending" },
];

export const quickStats = {
  totalBooksListed: 5,
  totalEarnings: 124.50,
  activePendingRequests: 2,
};

export const monthlyEarnings = [
  { month: "Feb", earnings: 840 },
  { month: "Mar", earnings: 1120 },
  { month: "Apr", earnings: 980 },
  { month: "May", earnings: 1350 },
  { month: "Jun", earnings: 1480 },
  { month: "Jul", earnings: 1620 },
];

export const topRequestedBooks = [
  { id: "bk_2001", title: "The Midnight Library", requests: 42 },
  { id: "bk_2002", title: "Klara and the Sun", requests: 38 },
  { id: "bk_2003", title: "Educated", requests: 27 },
  { id: "bk_2005", title: "Circe", requests: 15 },
];
