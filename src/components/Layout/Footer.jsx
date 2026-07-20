"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import {
  Button,
  Input,
} from "@heroui/react";

import {
  BookOpen,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="border-t border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
      <div className="container mx-auto px-6 py-16">

        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--rr-gold)] text-white">
                <BookOpen size={24} />
              </div>

              <div>
                <h2 className="font-bold text-xl tracking-wider text-[var(--rr-ink)]">
                  BIBLIODROP
                </h2>

                <p className="text-xs text-[var(--rr-ink-dim)] tracking-[3px] uppercase">
                  Local Library Delivery
                </p>
              </div>
            </div>

            <p className="text-[var(--rr-ink-dim)] leading-relaxed">
              Discover thousands of books from local libraries.
              Borrow, read, and enjoy premium reading experiences
              delivered directly to your doorstep.
            </p>

            <div className="flex gap-3 mt-6">
              <Button isIconOnly variant="flat" radius="full">
                <FaFacebookF />
              </Button>

              <Button isIconOnly variant="flat" radius="full">
                <FaTwitter />
              </Button>

              <Button isIconOnly variant="flat" radius="full">
                <FaInstagram />
              </Button>

              <Button isIconOnly variant="flat" radius="full">
                <FaLinkedinIn />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-[var(--rr-ink)]">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-[var(--rr-ink-dim)] hover:text-[var(--rr-gold)] transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/books"
                  className="text-[var(--rr-ink-dim)] hover:text-[var(--rr-gold)] transition"
                >
                  Browse Books
                </Link>
              </li>

              <li>
                <Link
                  href="/libraries"
                  className="text-[var(--rr-ink-dim)] hover:text-[var(--rr-gold)] transition"
                >
                  Libraries
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-[var(--rr-ink-dim)] hover:text-[var(--rr-gold)] transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-[var(--rr-ink-dim)] hover:text-[var(--rr-gold)] transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-[var(--rr-ink)]">
              Categories
            </h3>

            <ul className="space-y-3">
              <li className="text-[var(--rr-ink-dim)]">Fiction</li>
              <li className="text-[var(--rr-ink-dim)]">Science</li>
              <li className="text-[var(--rr-ink-dim)]">History</li>
              <li className="text-[var(--rr-ink-dim)]">Biography</li>
              <li className="text-[var(--rr-ink-dim)]">Technology</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-[var(--rr-ink)]">
              Stay Updated
            </h3>

            <p className="text-[var(--rr-ink-dim)] mb-4">
              Subscribe to receive new arrivals,
              book recommendations and library updates.
            </p>

            <div className="space-y-3">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--rr-ink-dim)]" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  radius="lg"
                  className="pl-10"
                />
              </div>

              <Button
                color="primary"
                className="w-full"
                radius="lg"
              >
                Subscribe
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-[var(--rr-ink-dim)]">
                <MapPin size={16} />
                <span>Dhaka, Bangladesh</span>
              </div>

              <div className="flex items-center gap-2 text-[var(--rr-ink-dim)]">
                <Phone size={16} />
                <span>+880 1234 567890</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-[var(--rr-hairline)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--rr-ink-dim)]">
            {mounted ? `© ${new Date().getFullYear()} BiblioDrop.` : "© BiblioDrop."}
            {" "}All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy-policy"
              className="text-[var(--rr-ink-dim)] hover:text-[var(--rr-gold)]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-[var(--rr-ink-dim)] hover:text-[var(--rr-gold)]"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/cookies"
              className="text-[var(--rr-ink-dim)] hover:text-[var(--rr-gold)]"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
