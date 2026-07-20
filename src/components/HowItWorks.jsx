"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, Truck, CheckCircle } from "lucide-react";

const steps = [
  { icon: Search, title: "Browse & Discover", description: "Explore our vast collection of books across various genres and categories.", color: "from-emerald-500 to-emerald-600" },
  { icon: BookOpen, title: "Request Delivery", description: "Select the books you want and request home delivery with just one click.", color: "from-amber-500 to-amber-600" },
  { icon: Truck, title: "We Deliver", description: "Our librarians carefully pack and deliver your books right to your doorstep.", color: "from-blue-500 to-blue-600" },
  { icon: CheckCircle, title: "Enjoy Reading", description: "Read at your pace, then return when you're ready. It's that simple!", color: "from-rose-500 to-rose-600" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

export default function HowItWorks() {
  return (
    <section className="py-20 bg-[var(--rr-bg)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--rr-gold)]/10 text-[var(--rr-gold)] text-xs font-semibold uppercase tracking-wider mb-4">How It Works</motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-bold text-[var(--rr-ink)]">Simple as 1-2-3-4</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-4 text-[var(--rr-ink-dim)] max-w-md mx-auto">Getting your favorite books delivered has never been easier</motion.p>
        </div>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div key={index} variants={itemVariants} className="relative text-center">
                {index < steps.length - 1 && <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[var(--rr-hairline)] to-transparent" />}
                <div className="relative inline-block mb-6">
                  <div className={`flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}><Icon size={36} /></div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--rr-ink)] text-[var(--rr-bg)] text-sm font-bold">{index + 1}</div>
                </div>
                <h3 className="text-lg font-bold text-[var(--rr-ink)] mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--rr-ink-dim)] leading-relaxed max-w-[250px] mx-auto">{step.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
