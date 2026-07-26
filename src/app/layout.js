import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ClientLayout from "../components/Layout/ClientLayout";
import { DeliveryProvider } from "../lib/delivery-context";
import { ReviewProvider } from "../lib/review-context";
import { ReadingListProvider } from "../lib/reading-list-context";
import { NotificationProvider } from "../lib/notification-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BiblioDrop",
  description: "Local Library Delivery",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          <DeliveryProvider>
            <ReviewProvider>
              <ReadingListProvider>
                <NotificationProvider>
                  <ClientLayout>{children}</ClientLayout>
                </NotificationProvider>
              </ReadingListProvider>
            </ReviewProvider>
          </DeliveryProvider>
        </Providers>
      </body>
    </html>
  );
}
