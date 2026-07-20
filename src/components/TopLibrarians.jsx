"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Truck, Star } from "lucide-react";
import Image from "next/image";

const topLibrarians = [
  {
    id: 1,
    name: "Arif Rahman",
    role: "Head Librarian",
    image: "https://i.ibb.co/PSrT8ht/PP-Younus.png",
    completedDeliveries: 1247,
    rating: 4.9,
    specialty: "Fiction & Literature",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: 2,
    name: "Fatima Khan",
    role: "Senior Librarian",
    image: "https://i.ibb.co/yFRJFYLm/PP-Hasan.png",
    completedDeliveries: 1089,
    rating: 4.8,
    specialty: "Academic & Research",
    color: "from-amber-500 to-amber-600",
  },
  {
    id: 3,
    name: "Sakib Hasan",
    role: "Librarian",
    image: "https://i.ibb.co/PSrT8ht/PP-Younus.png",
    completedDeliveries: 956,
    rating: 4.9,
    specialty: "Children's Books",
    color: "from-rose-500 to-rose-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

function LibrarianAvatar({ image, name, color }) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !image) {
    const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
    return (
      <div className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white text-3xl font-bold shadow-lg`}>
        {initials}
      </div>
    );
  }

  return (
    <div className={`relative h-24 w-24 overflow-hidden rounded-full shadow-lg ring-4 ring-[var(--rr-surface)]`}>
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover"
        sizes="96px"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

export default function TopLibrarians() {
  return (
    <section className="py-20 bg-[var(--rr-bg)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--rr-gold)]/10 text-[var(--rr-gold)] text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Award size={12} /> Top Providers
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-[var(--rr-ink)]"
          >
            Our Top Librarians
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[var(--rr-ink-dim)] max-w-md mx-auto"
          >
            Meet the dedicated librarians who make your reading experience possible
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {topLibrarians.map((librarian, index) => (
            <motion.div key={librarian.id} variants={cardVariants} whileHover={{ y: -8 }} className="group relative">
              {index === 0 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold shadow-lg">
                    <Star size={12} className="fill-white" /> #1 Top Librarian
                  </div>
                </div>
              )}
              <div className="relative overflow-hidden rounded-2xl bg-[var(--rr-surface)] border border-[var(--rr-hairline)] shadow-lg transition-shadow duration-300 group-hover:shadow-2xl">
                <div className={`h-2 bg-gradient-to-r ${librarian.color}`} />
                <div className="p-8 text-center">
                  <div className="relative inline-block mb-6">
                    <LibrarianAvatar
                      image={librarian.image}
                      name={librarian.name}
                      color={librarian.color}
                    />
                    {index === 0 && (
                      <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-white shadow-md">
                        <Award size={16} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--rr-ink)] group-hover:text-[var(--rr-gold)] transition-colors">
                    {librarian.name}
                  </h3>
                  <p className="text-sm text-[var(--rr-ink-dim)] mt-1">{librarian.role}</p>
                  <p className="text-xs text-[var(--rr-gold)] font-medium mt-2">{librarian.specialty}</p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-[var(--rr-bg)] p-3">
                      <div className="flex items-center justify-center gap-1.5 text-[var(--rr-ink-dim)] mb-1">
                        <Truck size={14} />
                        <span className="text-xs">Deliveries</span>
                      </div>
                      <p className="text-lg font-bold text-[var(--rr-ink)]">
                        {librarian.completedDeliveries.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[var(--rr-bg)] p-3">
                      <div className="flex items-center justify-center gap-1.5 text-[var(--rr-ink-dim)] mb-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs">Rating</span>
                      </div>
                      <p className="text-lg font-bold text-[var(--rr-ink)]">{librarian.rating}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--rr-surface)] border border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] text-sm">
            <BookOpen size={16} className="text-[var(--rr-gold)]" /> All deliveries handled with care by our trusted team
          </div>
        </motion.div>
      </div>
    </section>
  );
}
