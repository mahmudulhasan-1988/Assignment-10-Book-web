"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@heroui/react";

export default function PricingSuccessPage() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(searchParams.get("session_id"));
  }, [searchParams]);

  console.log(sessionId);

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-20 bg-[var(--rr-bg)]">
      {/* <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 mb-6"
          >
            <CheckCircle size={40} className="text-emerald-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-[var(--rr-ink)]"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-[var(--rr-ink-dim)] leading-relaxed"
          >
            Thank you for subscribing to BiblioDrop. Your premium features are now active.
            Enjoy unlimited deliveries and exclusive perks!
          </motion.p>

          {sessionId && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 text-xs text-[var(--rr-ink-dim)]/50 font-mono"
            >
              Session: {sessionId.slice(0, 20)}...
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/books">
              <Button className="bg-[var(--rr-gold)] hover:bg-[var(--rr-gold-bright)] text-white h-12 px-8 font-semibold rounded-xl">
                <BookOpen size={18} className="mr-2" />
                Browse Books
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="border-[var(--rr-hairline)] text-[var(--rr-ink)] h-12 px-8 font-semibold rounded-xl"
              >
                Back to Home
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div> */}
    </section>
  );
}
