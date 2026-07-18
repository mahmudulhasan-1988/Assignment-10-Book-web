export type DeliveryStatus = "Pending" | "Dispatched" | "Delivered";

export interface Delivery {
  id: string;
  title: string;
  fee: number;
  requestDate: string;
  status: DeliveryStatus;
}

export interface ReadingListItem {
  id: string;
  title: string;
  author: string;
  genre: string;
  returned: boolean;
}

export interface Review {
  id: string;
  bookTitle: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface MonthlyRead {
  month: string;
  count: number;
}

// --- Mock data. Replace with data fetched from your API / DB. ---

export const quickStats = {
  totalBooksRead: 27,
  pendingDeliveries: 3,
  totalSpentOnFees: 84,
};

export const monthlyReads: MonthlyRead[] = [
  { month: "Feb", count: 3 },
  { month: "Mar", count: 5 },
  { month: "Apr", count: 2 },
  { month: "May", count: 6 },
  { month: "Jun", count: 4 },
  { month: "Jul", count: 7 },
];

export const deliveries: Delivery[] = [
  { id: "d1", title: "The Midnight Library", fee: 3.5, requestDate: "2026-07-14", status: "Delivered" },
  { id: "d2", title: "Klara and the Sun", fee: 3.5, requestDate: "2026-07-10", status: "Delivered" },
  { id: "d3", title: "Piranesi", fee: 4.0, requestDate: "2026-07-16", status: "Dispatched" },
  { id: "d4", title: "The Vanishing Half", fee: 3.5, requestDate: "2026-07-17", status: "Dispatched" },
  { id: "d5", title: "Circe", fee: 4.0, requestDate: "2026-07-18", status: "Pending" },
  { id: "d6", title: "Project Hail Mary", fee: 3.5, requestDate: "2026-07-18", status: "Pending" },
];

export const readingList: ReadingListItem[] = [
  { id: "r1", title: "The Midnight Library", author: "Matt Haig", genre: "Fiction", returned: true },
  { id: "r2", title: "Klara and the Sun", author: "K. Ishiguro", genre: "Sci-Fi", returned: true },
  { id: "r3", title: "Educated", author: "Tara Westover", genre: "Memoir", returned: true },
  { id: "r4", title: "Circe", author: "Madeline Miller", genre: "Myth", returned: true },
];

export const reviews: Review[] = [
  {
    id: "rv1",
    bookTitle: "The Midnight Library",
    rating: 5,
    comment: "A gentle, hopeful read about the paths not taken. Finished it in two sittings.",
    date: "2026-07-15",
  },
  {
    id: "rv2",
    bookTitle: "Klara and the Sun",
    rating: 4,
    comment: "Quietly devastating. The narrator's voice stayed with me long after the last page.",
    date: "2026-07-11",
  },
  {
    id: "rv3",
    bookTitle: "Educated",
    rating: 5,
    comment: "One of the most striking memoirs I've read — clear-eyed and unflinching.",
    date: "2026-07-05",
  },
];

export const statusToChipColor: Record<DeliveryStatus, "warning" | "accent" | "success"> = {
  Pending: "warning",
  Dispatched: "accent",
  Delivered: "success",
};
