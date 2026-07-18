"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";
import { IoArrowForwardSharp } from "react-icons/io5";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      {/* <Image
        src="/images/book-bg.jpg"
        alt="Book Background"
        fill
        priority
        className="object-cover -z-30"
      /> */}

      {/* Dark Overlay */}
      {/* <div className="absolute inset-0 " /> */}

      {/* Gradient Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-950/70 to-black/90 -z-10" /> */}

      {/* Animated Light */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 blur-[180px] -translate-x-1/2 -translate-y-1/2 -z-10"
      />

      {/* Floating Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-2 h-2 rounded-full bg-pink-400"
          style={{
            left: `${10 + i * 8}%`,
            top: `${20 + (i % 4) * 15}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating Book */}
      <motion.div
        animate={{
          y: [-15, 15, -15],
          rotate: [-4, 4, -4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2"
      >
        <Image
          src="/images/book.png"
          alt="Book"
          width={320}
          height={420}
          className="drop-shadow-[0_0_60px_rgba(236,72,153,.5)]"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">

        <div className="max-w-4xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md text-pink-300 text-xs uppercase tracking-[3px] font-semibold"
          >
            <FaRocket />
            Best Selling Book Collection
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{ duration: 1 }}
            className="mt-8 text-5xl md:text-7xl font-extrabold leading-tight text-black"
          >
            Discover Your Next
            <br />

            <span className="text-black">
              Favorite Book
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="mt-8 max-w-2xl text-lg md:text-xl text-slate-400 leading-8"
          >
            Browse bestselling books, discover timeless classics, and explore
            thousands of inspiring stories from your favorite authors—all in one
            premium online bookstore.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="mt-10 flex flex-wrap gap-5"
          >
            <Link href="/books">
              <Button
                radius="full"
                className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white h-14 px-10 text-lg font-semibold hover:scale-105 transition-all"
              >
                Browse Books <IoArrowForwardSharp />
              </Button>
            </Link>

            <Link href="/categories">
              <Button
                radius="full"
                variant="bordered"
                className="border-2 border-pink-400 text-black h-14 px-10 text-lg hover:bg-zinc-200 hover:text-black transition-all"
              >
                Explore Categories
              </Button>
            </Link>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Hero;