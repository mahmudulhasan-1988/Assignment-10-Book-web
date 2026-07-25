"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Shield,
  Zap,
  Smartphone,
  MapPin,
  RefreshCw,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Vast Collection",
    description:
      "Access thousands of books from multiple partner libraries in your area.",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: Clock,
    title: "Same-Day Delivery",
    description:
      "Get your books delivered within hours. No more waiting for days.",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    icon: Shield,
    title: "Secure & Safe",
    description:
      "Your books are handled with care and delivered in perfect condition.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Zap,
    title: "Instant Requests",
    description:
      "Request any book with one click. Our system matches you instantly.",
    color: "from-violet-500 to-violet-600",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Manage your reading list and deliveries from anywhere on any device.",
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
  {
    icon: MapPin,
    title: "Track Delivery",
    description:
      "Real-time tracking so you know exactly when your books will arrive.",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description:
      "Return books at your convenience with our flexible return system.",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our team is always here to help with any questions or issues.",
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Features() {
  return (
    <section className="py-20 bg-[var(--rr-bg)]">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--rr-gold)]/10 text-[var(--rr-gold)] text-xs font-semibold uppercase tracking-wider mb-4"
          >
            Why Choose Us
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-[var(--rr-ink)]"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[var(--rr-ink-dim)] max-w-2xl mx-auto"
          >
            BiblioDrop combines the best of local libraries with modern
            convenience to deliver an unmatched reading experience.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative p-6 rounded-2xl border ${feature.borderColor} ${feature.bgColor} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                {/* Icon */}
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={28} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-[var(--rr-ink)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--rr-ink-dim)] leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                  <div
                    className={`absolute top-0 right-0 w-8 h-8 ${feature.bgColor} transform rotate-45 translate-x-4 -translate-y-4`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 text-[var(--rr-ink-dim)] text-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--rr-sage)] animate-pulse" />
            And many more features being added regularly
          </div>
        </motion.div>
      </div>
    </section>
  );
}
