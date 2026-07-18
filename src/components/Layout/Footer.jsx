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
import "./globals.css";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="border-t bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-6 py-16">

        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">

          {/* Brand */}

          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <BookOpen size={24} />
              </div>

              <div>
                <h2 className="font-bold text-xl tracking-wider">
                  BIBLIODROP
                </h2>

                <p className="text-xs text-default-500 tracking-[3px] uppercase">
                  Local Library Delivery
                </p>
              </div>
            </div>

            <p className="text-default-600 leading-relaxed">
              Discover thousands of books from local libraries.
              Borrow, read, and enjoy premium reading experiences
              delivered directly to your doorstep.
            </p>

            <div className="flex gap-3 mt-6">
              <Button
                isIconOnly
                variant="flat"
                radius="full"
              >
                <FaFacebookF />
              </Button>

              <Button
                isIconOnly
                variant="flat"
                radius="full"
              >
                <FaTwitter />
              </Button>

              <Button
                isIconOnly
                variant="flat"
                radius="full"
              >
                <FaInstagram />
              </Button>

              <Button
                isIconOnly
                variant="flat"
                radius="full"
              >
                <FaLinkedinIn />
              </Button>
            </div>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="font-semibold text-lg mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-default-600 hover:text-primary transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/books"
                  className="text-default-600 hover:text-primary transition"
                >
                  Browse Books
                </Link>
              </li>

              <li>
                <Link
                  href="/libraries"
                  className="text-default-600 hover:text-primary transition"
                >
                  Libraries
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-default-600 hover:text-primary transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-default-600 hover:text-primary transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}

          <div>
            <h3 className="font-semibold text-lg mb-5">
              Categories
            </h3>

            <ul className="space-y-3">
              <li className="text-default-600">
                Fiction
              </li>

              <li className="text-default-600">
                Science
              </li>

              <li className="text-default-600">
                History
              </li>

              <li className="text-default-600">
                Biography
              </li>

              <li className="text-default-600">
                Technology
              </li>
            </ul>
          </div>

          {/* Newsletter */}

          <div>
            <h3 className="font-semibold text-lg mb-5">
              Stay Updated
            </h3>

            <p className="text-default-600 mb-4">
              Subscribe to receive new arrivals,
              book recommendations and library updates.
            </p>

            <div className="space-y-3">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-default-400" />
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

              <div className="flex items-center gap-2 text-default-600">
                <MapPin size={16} />
                <span>Dhaka, Bangladesh</span>
              </div>

              <div className="flex items-center gap-2 text-default-600">
                <Phone size={16} />
                <span>+880 1234 567890</span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom */}

        <div className="mt-14 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-sm text-default-500">
            {mounted ? `© ${new Date().getFullYear()} BiblioDrop.` : "© BiblioDrop."}
            All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy-policy"
              className="text-default-500 hover:text-primary"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-default-500 hover:text-primary"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/cookies"
              className="text-default-500 hover:text-primary"
            >
              Cookie Policy
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}