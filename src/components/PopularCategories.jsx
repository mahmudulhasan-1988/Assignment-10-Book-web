"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Rocket, GraduationCap, User, Clock, Smile, Feather, Scroll, ArrowRight, Loader2 } from "lucide-react";

const categoryIcons = { Fiction: BookOpen, "Sci-Fi & Fantasy": Rocket, Academic: GraduationCap, Biography: User, History: Clock, "Children's": Smile, Poetry: Feather, "Self-Help": Scroll };
const categoryColors = { Fiction: "from-emerald-500 to-emerald-600", "Sci-Fi & Fantasy": "from-blue-500 to-blue-600", Academic: "from-purple-500 to-purple-600", Biography: "from-amber-500 to-amber-600", History: "from-rose-500 to-rose-600", "Children's": "from-teal-500 to-teal-600", Poetry: "from-pink-500 to-pink-600", "Self-Help": "from-indigo-500 to-indigo-600" };

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } } };

export default function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/books");
        if (!res.ok) throw new Error("Failed");
        const books = await res.json();
        const categoryCount = {};
        books.forEach((book) => { const cat = book.category || "Other"; categoryCount[cat] = (categoryCount[cat] || 0) + 1; });
        setCategories(Object.entries(categoryCount).map(([name, count]) => ({ name, count, icon: categoryIcons[name] || BookOpen, color: categoryColors[name] || "from-gray-500 to-gray-600" })).sort((a, b) => b.count - a.count).slice(0, 8));
      } catch {
        setCategories([
          { name: "Fiction", count: 0, icon: BookOpen, color: "from-emerald-500 to-emerald-600" },
          { name: "Sci-Fi & Fantasy", count: 0, icon: Rocket, color: "from-blue-500 to-blue-600" },
          { name: "Academic", count: 0, icon: GraduationCap, color: "from-purple-500 to-purple-600" },
          { name: "Biography", count: 0, icon: User, color: "from-amber-500 to-amber-600" },
        ]);
      } finally { setLoading(false); }
    }
    fetchCategories();
  }, []);

  return (
    <section className="py-20 bg-[var(--rr-surface)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--rr-gold)]/10 text-[var(--rr-gold)] text-xs font-semibold uppercase tracking-wider mb-4"><BookOpen size={12} /> Browse by Category</motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-bold text-[var(--rr-ink)]">Popular Categories</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-2 text-[var(--rr-ink-dim)] max-w-md">Explore our collection by your favorite genre</motion.p>
          </div>
          <Link href="/books" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[var(--rr-gold)] hover:text-[var(--rr-gold-bright)] transition-colors">View All <ArrowRight size={16} /></Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16"><Loader2 size={40} className="animate-spin text-[var(--rr-gold)]" /></div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.div key={category.name} variants={itemVariants}>
                  <Link href={`/books?category=${encodeURIComponent(category.name)}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl bg-[var(--rr-bg)] border border-[var(--rr-hairline)] p-6 transition-all duration-300 hover:bg-[var(--rr-surface)] hover:shadow-xl hover:-translate-y-1">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white mb-4 transition-transform duration-300 group-hover:scale-110`}><Icon size={22} /></div>
                      <h3 className="font-semibold text-[var(--rr-ink)] group-hover:text-[var(--rr-gold)] transition-colors">{category.name}</h3>
                      <p className="mt-1 text-sm text-[var(--rr-ink-dim)]">{category.count} {category.count === 1 ? "book" : "books"}</p>
                      <div className="absolute top-6 right-6 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"><ArrowRight size={18} className="text-[var(--rr-gold)]" /></div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
