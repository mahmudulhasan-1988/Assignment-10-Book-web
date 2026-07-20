"use client";

import { motion } from "framer-motion";
import { Shield, Clock, CreditCard, Headphones, BookOpen, Truck } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Delivery", description: "Free delivery on orders over $20. Fast and reliable shipping.", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { icon: Shield, title: "Secure Payments", description: "Your payment information is encrypted and never stored.", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { icon: Clock, title: "24/7 Support", description: "Our team is always here to help with any questions.", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { icon: CreditCard, title: "Easy Returns", description: "Not satisfied? Return within 7 days for a full refund.", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
  { icon: BookOpen, title: "Vast Collection", description: "Over 10,000 books across 50+ categories.", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { icon: Headphones, title: "Expert Guidance", description: "Get personalized book recommendations from our librarians.", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-[var(--rr-bg)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--rr-gold)]/10 text-[var(--rr-gold)] text-xs font-semibold uppercase tracking-wider mb-4">Why Choose Us</motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-bold text-[var(--rr-ink)]">Why Readers Love BiblioDrop</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-4 text-[var(--rr-ink-dim)] max-w-md mx-auto">We&apos;re committed to providing the best book delivery experience</motion.p>
        </div>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -4 }} className="group p-6 rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] hover:shadow-lg transition-all duration-300">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} ${feature.color} mb-4 transition-transform duration-300 group-hover:scale-110`}><Icon size={22} /></div>
                <h3 className="text-lg font-bold text-[var(--rr-ink)] mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--rr-ink-dim)] leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
