"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowForwardSharp, IoArrowBack, IoArrowForward } from "react-icons/io5";

const slides = [
  {
    id: 1,
    badge: "Welcome to BiblioDrop",
    title: "Discover Your Next\nFavorite Book",
    description:
      "Browse bestselling books, discover timeless classics, and explore thousands of inspiring stories from your favorite authors—all delivered to your doorstep.",
    cta: "Browse Books",
    ctaLink: "/books",
    secondaryCta: "Explore Categories",
    secondaryLink: "/books",
    quote: "A reader lives a thousand lives before he dies.",
    quoteAuthor: "George R.R. Martin",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&h=1080&fit=crop",
    gradient: "from-emerald-950/95 via-emerald-900/80 to-emerald-800/60",
    accent: "emerald",
  },
  {
    id: 2,
    badge: "Free Delivery",
    title: "Books Delivered\nTo Your Door",
    description:
      "Request any book from our collection and have it delivered to your doorstep. Track your deliveries in real-time and enjoy seamless reading.",
    cta: "Request Delivery",
    ctaLink: "/books",
    secondaryCta: "How It Works",
    secondaryLink: "/books",
    quote: "Books are a uniquely portable magic.",
    quoteAuthor: "Stephen King",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&h=1080&fit=crop",
    gradient: "from-amber-950/95 via-amber-900/80 to-amber-800/60",
    accent: "amber",
  },
  {
    id: 3,
    badge: "Community",
    title: "Share Your\nReading Journey",
    description:
      "Join thousands of readers sharing reviews, recommendations, and building their personal reading lists. Your next favorite book is just a review away.",
    cta: "Join Now",
    ctaLink: "/register",
    secondaryCta: "View Reviews",
    secondaryLink: "/books",
    quote: "There is no friend as loyal as a book.",
    quoteAuthor: "Ernest Hemingway",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=1080&fit=crop",
    gradient: "from-rose-950/95 via-rose-900/80 to-rose-800/60",
    accent: "rose",
  },
];

const accentStyles = {
  emerald: {
    badge: "bg-emerald-500/20 border-emerald-400/40 text-emerald-300",
    cta: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25",
    dot: "bg-emerald-400",
    progress: "bg-emerald-400",
  },
  amber: {
    badge: "bg-amber-500/20 border-amber-400/40 text-amber-300",
    cta: "bg-amber-600 hover:bg-amber-500 shadow-amber-500/25",
    dot: "bg-amber-400",
    progress: "bg-amber-400",
  },
  rose: {
    badge: "bg-rose-500/20 border-rose-400/40 text-rose-300",
    cta: "bg-rose-600 hover:bg-rose-500 shadow-rose-500/25",
    dot: "bg-rose-400",
    progress: "bg-rose-400",
  },
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goTo = useCallback(
    (index) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];
  const colors = accentStyles[slide.accent];

  return (
    <section className="relative h-[92vh] min-h-[650px] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm text-xs uppercase tracking-[2px] font-semibold ${colors.badge}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {slide.badge}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] text-white whitespace-pre-line"
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 max-w-lg text-lg text-white/80 leading-relaxed"
                >
                  {slide.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-10 flex flex-wrap gap-4"
                >
                  <Link href={slide.ctaLink}>
                    <Button
                      radius="full"
                      className={`${colors.cta} text-white h-14 px-8 text-base font-semibold transition-all hover:scale-105 shadow-lg`}
                    >
                      {slide.cta}
                      <IoArrowForwardSharp className="ml-2" />
                    </Button>
                  </Link>
                  <Link href={slide.secondaryLink}>
                    <Button
                      radius="full"
                      variant="bordered"
                      className="border-white/30 text-white h-14 px-8 text-base font-semibold hover:bg-white/10 transition-all"
                    >
                      {slide.secondaryCta}
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="relative p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                  <div className="text-white/30 text-5xl mb-2 font-serif leading-none">&ldquo;</div>
                  <p className="text-2xl text-white/90 font-serif italic leading-relaxed">
                    {slide.quote}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className={`w-10 h-1 rounded-full ${colors.dot}`} />
                    <span className="text-white/70 text-sm font-medium">{slide.quoteAuthor}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/50 to-transparent pb-8 pt-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className="group"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index === current
                        ? `w-12 ${colors.progress}`
                        : "w-6 bg-white/30 group-hover:bg-white/50"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-white/50 font-mono tabular-nums">
                {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white/70 transition-all hover:bg-white/10 hover:text-white hover:border-white/50"
                aria-label="Previous slide"
              >
                <IoArrowBack size={18} />
              </button>
              <button
                onClick={next}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white/70 transition-all hover:bg-white/10 hover:text-white hover:border-white/50"
                aria-label="Next slide"
              >
                <IoArrowForward size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
        <motion.div
          key={current}
          className={`h-full ${colors.progress}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
        />
      </div>
    </section>
  );
}
