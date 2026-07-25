"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useRouter,
  usePathname,
} from "next/navigation";

import {
  BookOpen,
  LogIn,
  UserPlus,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

import ThemeToggle from "../ThemeToggle";
import { authClient, useSession } from "@/lib/auth-client";

import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Browse Books",
    href: "/books",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
];

export default function Navbar() {
  // const [session, setSession] = useState(null);
// session is provided by `authClient.useSession()` below; no local setter needed
  
  const router = useRouter();
  // const {data: session} = useSession()
  const pathname = usePathname();

  
  const { data: session, isPending } =
    authClient.useSession();

  const [open, setOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [mounted, setMounted] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  
  useEffect(() => {
  setMounted(true);
}, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);



  const handleLogout = async () => {
    await authClient.signOut();

    router.push("/");

    router.refresh();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
    if (!mounted) {
  return null;
}

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      scrolled
        ? "border-[var(--rr-hairline)] bg-[var(--rr-bg)] shadow-lg backdrop-blur-xl"
        : "border-transparent bg-[var(--rr-bg)]/80 backdrop-blur-md"
    }`}>

      <div className="container mx-auto flex h-20 items-center justify-between px-5">

        {/* Logo */}

        <Link
          href="/"
          onClick={scrollToTop}
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--rr-ink)] text-[var(--rr-bg)]">
            <BookOpen size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-[4px]">
              BIBLIODROP
            </h2>

            <p className="text-xs uppercase tracking-[4px] text-[var(--rr-ink-dim)]">
              Local Library Delivery
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}

        <nav className="hidden items-center gap-10 md:flex">

          {navLinks.map((item) => (

            <Link
              key={item.href}
              href={item.href}
              onClick={item.href === "/" ? scrollToTop : undefined}
              className={`transition font-medium ${
                pathname === item.href
                  ? "text-blue-600"
                  : "hover:text-blue-600"
              }`}
            >
              {item.title}
            </Link>

          ))}

        </nav>

        {/* Desktop Right */}

        <div className="hidden items-center gap-4 md:flex">

          <ThemeToggle />

          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--rr-surface-2)]" />
          ) : session?.user ? (

            <div
              className="relative"
              ref={dropdownRef}
            >

              <button
                onClick={() =>
                  setDropdownOpen(!dropdownOpen)
                }
                className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-[var(--rr-surface-2)]"
              >

                <Image
                  src={
                    session.user?.image ||
                    "/default-avatar.png"
                  }
                  alt={session.user?.name || "User"}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <ChevronDown size={18} />

              </button>
          {dropdownOpen && (
  <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] shadow-xl">

    <div className="border-b p-5 text-center">

      <Image
        src={session.user?.image || "/default-avatar.png"}
        alt={session.user?.name || "User"}
        width={70}
        height={70}
        className="mx-auto h-[70px] w-[70px] rounded-full object-cover"
      />

      <h3 className="mt-3 font-semibold">
        {session.user?.name}
      </h3>

      <p className="text-sm text-[var(--rr-ink-dim)]">
        {session.user?.email}
      </p>

    </div>

    <Link
      href="/profile"
      onClick={() => setDropdownOpen(false)}
      className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--rr-surface-2)]"
    >
      <User size={18} />
      Profile
    </Link>

    <Link
      href={`/dashboard/${session.user?.role || ""}`}
      onClick={() => setDropdownOpen(false)}
      className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--rr-surface-2)]"
    >
      <LayoutDashboard size={18} />
      Dashboard
    </Link>

    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
    >
      <LogOut size={18} />
      Logout
    </button>

  </div>
)}

</div>

          ) : (

            <>

            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full border px-6 py-2 hover:bg-[var(--rr-surface-2)]"
            >
              <LogIn size={18} />
              Login
            </Link>

            <Link
              href="/register"
              className="flex items-center gap-2 rounded-full bg-[var(--rr-ink)] px-6 py-2 text-[var(--rr-bg)]"
            >
              <UserPlus size={18} />
              Register
            </Link>

            </>

          )}

        </div>

{/* Mobile */}

<div className="flex items-center gap-2 md:hidden">

  <ThemeToggle />

  <button
    onClick={() => setOpen(!open)}
    className="relative flex h-10 w-10 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--rr-surface-2)]"
    aria-label={open ? "Close menu" : "Open menu"}
  >
    <div className="flex flex-col items-center justify-center gap-1.5">
      <span className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
      <span className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${open ? "scale-x-0" : ""}`} />
      <span className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
    </div>
  </button>

</div>

</div>

<AnimatePresence>
{open && (

<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
  className="overflow-hidden border-t border-[var(--rr-hairline)] bg-[var(--rr-bg)] md:hidden"
>

  <div className="flex flex-col gap-4 p-5">

    {navLinks.map((item) => (

      <Link
        key={item.href}
        href={item.href}
        onClick={() => {
          setOpen(false);
          if (item.href === "/") scrollToTop();
        }}
        className={`${
          pathname === item.href
            ? "font-semibold text-blue-600"
            : ""
        }`}
      >
        {item.title}
      </Link>

    ))}

    <hr />

    {session?.user ? (

      <>

        <div className="flex items-center gap-3">

          <Image
            src={session.user.image || "/default-avatar.png"}
            alt={session.user.name}
            width={45}
            height={45}
            className="rounded-full"
          />

          <div>

            <p className="font-semibold">
              {session.user.name}
            </p>

            <p className="text-xs text-[var(--rr-ink-dim)]">
              {session.user.email}
            </p>

          </div>

        </div>

        <Link
          href="/profile"
          onClick={() => setOpen(false)}
        >
          Profile
        </Link>

        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
        >
          Dashboard
        </Link>

        <button
          onClick={handleLogout}
          className="text-left text-red-500"
        >
          Logout
        </button>

      </>

    ) : (

      <>

        <Link
          href="/login"
          onClick={() => setOpen(false)}
        >
          Login
        </Link>

        <Link
          href="/register"
          onClick={() => setOpen(false)}
        >
          Register
        </Link>

      </>

    )}

  </div>

</motion.div>

)}

</AnimatePresence>

</header>

);
}