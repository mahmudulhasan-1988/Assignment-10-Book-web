"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  { id: 1, name: "Sarah Mitchell", role: "Avid Reader", avatar: "SM", rating: 5, text: "BiblioDrop has completely changed how I discover books. The delivery is fast, and I love being able to track everything in my dashboard.", color: "from-emerald-500 to-emerald-600" },
  { id: 2, name: "James Chen", role: "Book Club Organizer", avatar: "JC", rating: 5, text: "As someone who runs a book club, BiblioDrop is a lifesaver. I can request multiple books at once and they always arrive on time.", color: "from-amber-500 to-amber-600" },
  { id: 3, name: "Emily Rodriguez", role: "Student", avatar: "ER", rating: 5, text: "The delivery fees are so affordable compared to buying books. I've saved hundreds of dollars this semester alone.", color: "from-rose-500 to-rose-600" },
  { id: 4, name: "Michael Park", role: "Teacher", avatar: "MP", rating: 5, text: "I recommend BiblioDrop to all my students. The selection is incredible, and the community reviews help them find great books.", color: "from-blue-500 to-blue-600" },
  { id: 5, name: "Aisha Patel", role: "Book Enthusiast", avatar: "AP", rating: 5, text: "The quality of books is always excellent, and I love the personalized recommendations.", color: "from-purple-500 to-purple-600" },
];

const stats = [
  { value: "10K+", label: "Happy Readers" },
  { value: "50K+", label: "Books Delivered" },
  { value: "4.9", label: "Average Rating" },
  { value: "99%", label: "On-Time Delivery" },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const testimonial = testimonials[current];

  return (
    <section className="py-20 bg-[var(--rr-bg)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--rr-gold)]/10 text-[var(--rr-gold)] text-xs font-semibold uppercase tracking-wider mb-4"><Star size={12} className="fill-current" /> Testimonials</motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-bold text-[var(--rr-ink)]">What Our Readers Say</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-4 text-[var(--rr-ink-dim)] max-w-md mx-auto">Join thousands of book lovers who trust BiblioDrop</motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 p-6 rounded-2xl bg-gradient-to-r from-[#1a2e1a] to-[#243524]">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[var(--rr-gold)]">{stat.value}</div>
              <div className="mt-1 text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div key={testimonial.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="relative p-8 md:p-12 rounded-3xl bg-[var(--rr-surface)] border border-[var(--rr-hairline)] shadow-lg">
            <div className="absolute -top-5 left-8"><div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${testimonial.color}`}><Quote size={20} className="text-white" /></div></div>
            <div className="flex gap-1 mb-6">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} size={18} className="fill-amber-400 text-amber-400" />))}</div>
            <p className="text-lg md:text-xl text-[var(--rr-ink)] leading-relaxed mb-8">&ldquo;{testimonial.text}&rdquo;</p>
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-white font-bold text-lg`}>{testimonial.avatar}</div>
              <div><h4 className="font-semibold text-[var(--rr-ink)]">{testimonial.name}</h4><p className="text-sm text-[var(--rr-ink-dim)]">{testimonial.role}</p></div>
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface)] transition-colors"><ChevronLeft size={20} /></button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (<button key={index} onClick={() => setCurrent(index)} className={`h-2 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-[var(--rr-gold)]" : "w-2 bg-[var(--rr-ink-dim)]/30"}`} />))}
            </div>
            <button onClick={next} className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface)] transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
