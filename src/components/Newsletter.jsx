"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, BookOpen, Sparkles } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail("");
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: "#1a2e1a" }} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[var(--rr-gold)]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[var(--rr-gold)]/5 blur-3xl" />
        {[Mail, Sparkles, BookOpen].map((Icon, i) => (
          <motion.div key={i} className="absolute text-white/5" style={{ left: `${20 + i * 30}%`, top: `${30 + (i % 2) * 40}%` }} animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5], opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}>
            <Icon size={60 + i * 20} />
          </motion.div>
        ))}
      </div>
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--rr-gold)]/20 mb-6"><Mail size={28} className="text-[var(--rr-gold)]" /></motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white">Stay in the Loop</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-4 text-white/60 max-w-md mx-auto">Subscribe to get notified about new book arrivals and exclusive offers.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-8">
            {isSubscribed ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
                <CheckCircle size={20} className="text-emerald-400" />
                <span className="text-emerald-300 font-medium">Thanks for subscribing!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[var(--rr-gold)] focus:ring-2 focus:ring-[var(--rr-gold)]/20 transition-all" />
                </div>
                <button type="submit" disabled={isLoading} className="h-14 px-8 rounded-xl bg-[var(--rr-gold)] text-white font-semibold hover:bg-[var(--rr-gold-bright)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Subscribing...</> : "Subscribe"}
                </button>
              </form>
            )}
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mt-6 text-xs text-white/40">No spam, unsubscribe anytime. Join 5,000+ book lovers.</motion.p>
        </div>
      </div>
    </section>
  );
}
