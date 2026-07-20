"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1a2e1a] via-[#243524] to-[#1a2e1a] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--rr-gold)]/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[var(--rr-gold)]/5 blur-3xl" />
      </div>
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--rr-gold)]/20 mb-6"><Sparkles size={28} className="text-[var(--rr-gold)]" /></motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold text-white leading-tight">Ready to Start Your<br /><span className="text-[var(--rr-gold)]">Reading Adventure?</span></motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-6 text-lg text-white/70 max-w-xl mx-auto">Join thousands of book lovers who trust BiblioDrop for their reading needs.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--rr-gold)] text-white font-semibold text-lg hover:bg-[var(--rr-gold-bright)] transition-all duration-300 hover:shadow-lg">Get Started Free <ArrowRight size={20} /></Link>
            <Link href="/books" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300"><BookOpen size={20} /> Browse Books</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-white/50">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Free Delivery</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /> No Hidden Fees</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Cancel Anytime</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
