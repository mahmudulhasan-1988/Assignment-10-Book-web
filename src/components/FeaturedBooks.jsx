"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ChevronRight, BookOpen, Truck, Eye, Loader2 } from "lucide-react";
import DeliveryRequestModal from "@/components/books/DeliveryRequestModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function BookCard({ book, onRequestDelivery }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const statusColors = {
    available: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    checked_out: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    pending: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  const statusLabels = { available: "Available", checked_out: "Checked Out", pending: "Pending" };

  return (
    <motion.div variants={itemVariants} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="group relative">
      <div className="relative overflow-hidden rounded-2xl bg-[var(--rr-surface)] shadow-md transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:shadow-2xl hover:-translate-y-3 hover:border-[var(--rr-gold)]/30 border border-[var(--rr-hairline)]">
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--rr-surface-2)]">
          {!imgError ? (
            <Image src={book.coverImage} alt={book.title} fill className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" onError={() => setImgError(true)} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[var(--rr-surface-2)]"><BookOpen size={40} className="text-[var(--rr-ink-dim)]" /></div>
          )}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Link href={`/books/${book._id || book.id}`} className={`flex h-12 w-12 items-center justify-center rounded-full bg-[var(--rr-surface)] text-[var(--rr-ink)] transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110 hover:shadow-lg ${isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`} style={{ transitionDelay: isHovered ? '50ms' : '0ms' }}><Eye size={20} /></Link>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRequestDelivery(book); }} className={`flex h-12 w-12 items-center justify-center rounded-full bg-[var(--rr-gold)] text-white transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110 hover:shadow-lg hover:shadow-[var(--rr-gold)]/30 ${isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`} style={{ transitionDelay: isHovered ? '100ms' : '0ms' }} title="Request Delivery"><Truck size={20} /></button>
          </div>
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${statusColors[book.status] || statusColors.available}`}>{statusLabels[book.status] || "Available"}</span>
          </div>
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--rr-surface)]/90 backdrop-blur-sm transition-all duration-300 group-hover:scale-110">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-[var(--rr-ink)]">{book.rating || 0}</span>
            </div>
          </div>
        </div>
        <div className="p-4 transition-all duration-300">
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen size={12} className="text-[var(--rr-gold)] transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--rr-gold)]">{book.category}</span>
          </div>
          <h3 className="font-display text-base font-semibold text-[var(--rr-ink)] line-clamp-1 group-hover:text-[var(--rr-gold)] transition-colors duration-300">{book.title}</h3>
          <p className="mt-1 text-sm text-[var(--rr-ink-dim)] transition-colors duration-300 group-hover:text-[var(--rr-ink)]">{book.author}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-[var(--rr-ink)] transition-colors duration-300 group-hover:text-[var(--rr-gold)]">${(book.deliveryFee || 0).toFixed(2)}</span>
              <span className="text-xs text-[var(--rr-ink-dim)]">delivery</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--rr-ink-dim)]">
              <Star size={10} className="fill-[var(--rr-hairline)] text-[var(--rr-hairline)]" />
              <span>{(book.totalReviews || 0).toLocaleString()} reviews</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    async function fetchFeaturedBooks() {
      try {
        setLoading(true);
        const res = await fetch("/api/books?page=1&limit=8&sort=newest");
        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        // Handle both paginated and array responses
        const booksList = data.books || (Array.isArray(data) ? data : []);
        setBooks(booksList.slice(0, 8));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedBooks();
  }, []);

  const displayBooks = books.slice(0, 8);

  return (
    <section className="py-20 bg-[var(--rr-bg)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--rr-gold)]/10 text-[var(--rr-gold)] text-xs font-semibold uppercase tracking-wider mb-4">
                <Star size={12} className="fill-current" /> Featured Collection
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-[var(--rr-ink)]">Trending Books</motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-2 text-[var(--rr-ink-dim)] max-w-md">Discover our most popular books, handpicked for our readers</motion.p>
            </div>
            <Link href="/books" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--rr-gold)] hover:text-[var(--rr-gold-bright)] transition-colors">View All Books <ChevronRight size={16} /></Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16"><Loader2 size={40} className="animate-spin text-[var(--rr-gold)]" /><p className="mt-4 text-[var(--rr-ink-dim)]">Loading featured books...</p></div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center"><BookOpen size={48} className="text-[var(--rr-ink-dim)] mb-4 opacity-30" /><p className="text-[var(--rr-ink-dim)]">Unable to load books</p></div>
        ) : displayBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center"><BookOpen size={48} className="text-[var(--rr-ink-dim)] mb-4 opacity-30" /><p className="text-[var(--rr-ink-dim)]">No books available yet</p></div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayBooks.map((book) => (<BookCard key={book._id || book.id} book={book} onRequestDelivery={setSelectedBook} />))}
          </motion.div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/books" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--rr-gold)] text-white font-semibold hover:bg-[var(--rr-gold-bright)] transition-colors">View All Books <ChevronRight size={16} /></Link>
        </div>
      </div>

      {selectedBook && <DeliveryRequestModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </section>
  );
}
