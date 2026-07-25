"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, Verified } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Avid Reader",
    avatar: "SM",
    rating: 5,
    text: "BiblioDrop has completely changed how I discover books. The delivery is fast, and I love being able to track everything in my dashboard. It's like having a personal librarian!",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-500/10",
    booksDelivered: 47,
    verified: true,
  },
  {
    id: 2,
    name: "James Chen",
    role: "Book Club Organizer",
    avatar: "JC",
    rating: 5,
    text: "As someone who runs a book club, BiblioDrop is a lifesaver. I can request multiple books at once and they always arrive on time. Our club has never been more active!",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-500/10",
    booksDelivered: 89,
    verified: true,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Student at Dhaka University",
    avatar: "ER",
    rating: 5,
    text: "The delivery fees are so affordable compared to buying books. I've saved hundreds of dollars this semester alone. The student discount is amazing too!",
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-500/10",
    booksDelivered: 34,
    verified: true,
  },
  {
    id: 4,
    name: "Michael Park",
    role: "High School Teacher",
    avatar: "MP",
    rating: 5,
    text: "I recommend BiblioDrop to all my students. The selection is incredible, and the community reviews help them find great books. It's revolutionized how we approach reading assignments.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    booksDelivered: 62,
    verified: true,
  },
  {
    id: 5,
    name: "Aisha Patel",
    role: "Book Enthusiast",
    avatar: "AP",
    rating: 5,
    text: "The quality of books is always excellent, and I love the personalized recommendations. The app is so easy to use, and customer support is fantastic!",
    color: "from-violet-500 to-violet-600",
    bgColor: "bg-violet-500/10",
    booksDelivered: 156,
    verified: true,
  },
  {
    id: 6,
    name: "David Wilson",
    role: "Retired Professor",
    avatar: "DW",
    rating: 5,
    text: "At my age, going to the library isn't as easy as it used to be. BiblioDrop brings the library to me. The service is reliable, and the books always arrive in perfect condition.",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-500/10",
    booksDelivered: 78,
    verified: true,
  },
];

const stats = [
  { value: "10K+", label: "Happy Readers" },
  { value: "50K+", label: "Books Delivered" },
  { value: "4.9", label: "Average Rating" },
  { value: "99%", label: "On-Time Delivery" },
];

const featuredReviews = [
  {
    name: "Fatima Rahman",
    rating: 5,
    text: "Best library service in Bangladesh! Fast delivery and huge collection.",
    avatar: "FR",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Arif Hassan",
    rating: 5,
    text: "My kids love reading now thanks to BiblioDrop. The children's section is amazing!",
    avatar: "AH",
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Nadia Khan",
    rating: 5,
    text: "I've discovered so many new authors through their recommendations. Highly recommend!",
    avatar: "NK",
    color: "from-orange-500 to-amber-500",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goTo = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, []);

  const testimonial = testimonials[current];

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
            <Star size={14} className="fill-current" />
            Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-[var(--rr-ink)]"
          >
            What Our Readers Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[var(--rr-ink-dim)] max-w-md mx-auto"
          >
            Join thousands of book lovers who trust BiblioDrop
          </motion.p>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 p-6 rounded-2xl" style={{ backgroundColor: "#1a2e1a" }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[var(--rr-gold)]">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Main Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: direction * 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative p-8 md:p-12 rounded-3xl bg-[var(--rr-surface)] border border-[var(--rr-hairline)] shadow-xl"
              >
                {/* Quote Icon */}
                <div className="absolute -top-5 left-8">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${testimonial.color} shadow-lg`}
                  >
                    <Quote size={24} className="text-white" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6 mt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-lg md:text-xl text-[var(--rr-ink)] leading-relaxed mb-8 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-white font-bold text-xl shadow-lg`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[var(--rr-ink)] text-lg">
                          {testimonial.name}
                        </h4>
                        {testimonial.verified && (
                          <Verified size={18} className="text-[var(--rr-slate)] fill-[var(--rr-slate)]" />
                        )}
                      </div>
                      <p className="text-sm text-[var(--rr-ink-dim)]">{testimonial.role}</p>
                    </div>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-full ${testimonial.bgColor} text-[var(--rr-ink)] text-sm font-medium`}
                  >
                    {testimonial.booksDelivered} books delivered
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] hover:bg-[var(--rr-ink)] hover:text-[var(--rr-bg)] hover:border-[var(--rr-ink)] transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? "w-10 bg-[var(--rr-ink)]"
                      : "w-2 bg-[var(--rr-hairline)] hover:bg-[var(--rr-ink-dim)]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] hover:bg-[var(--rr-ink)] hover:text-[var(--rr-bg)] hover:border-[var(--rr-ink)] transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Featured Reviews Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          {featuredReviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-[var(--rr-surface)] border border-[var(--rr-hairline)] shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-[var(--rr-ink-dim)] text-sm leading-relaxed mb-4">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${review.color} text-white text-sm font-bold`}
                >
                  {review.avatar}
                </div>
                <span className="font-medium text-[var(--rr-ink)] text-sm">
                  {review.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
