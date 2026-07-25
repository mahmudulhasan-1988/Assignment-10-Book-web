import { Button } from "@heroui/react";
import Link from "next/link";
import { BookOpen, Users, Library, Heart } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { number: "50+", label: "Partner Libraries" },
    { number: "10K+", label: "Books Available" },
    { number: "25K+", label: "Happy Readers" },
    { number: "100+", label: "Cities Covered" },
  ];

  const values = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Access to Knowledge",
      description:
        "We believe everyone deserves access to books and knowledge, regardless of their location.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community First",
      description:
        "Building stronger communities by connecting readers with their local libraries.",
    },
    {
      icon: <Library className="h-8 w-8" />,
      title: "Support Local Libraries",
      description:
        "Empowering local libraries with technology to reach more readers and expand their impact.",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Reading Matters",
      description:
        "Promoting literacy and the joy of reading for people of all ages and backgrounds.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/team/sarah.jpg",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/team/michael.jpg",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Operations",
      image: "/team/emily.jpg",
    },
    {
      name: "David Kim",
      role: "Head of Partnerships",
      image: "/team/david.jpg",
    },
  ];

  return (
    <main className="bg-[var(--rr-bg)]">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <span className="inline-flex rounded-full border border-[var(--rr-hairline)] px-4 py-1 text-sm font-medium text-[var(--rr-ink)]">
          About BiblioDrop
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl text-[var(--rr-ink)]">
          Connecting Readers
          <span className="block text-[var(--rr-gold)]">With Local Libraries</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--rr-ink-dim)]">
          BiblioDrop is on a mission to make books accessible to everyone by
          bridging the gap between local libraries and readers through convenient
          home delivery.
        </p>
      </section>

      {/* Stats Section */}
      <section className="border-y border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-[var(--rr-gold)]">
                  {stat.number}
                </div>
                <div className="mt-2 text-sm text-[var(--rr-ink-dim)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-[var(--rr-ink)]">Our Story</h2>
            <p className="mt-6 text-[var(--rr-ink-dim)] leading-relaxed">
              BiblioDrop was born from a simple observation: while local libraries
              hold treasures of knowledge, many people struggle to access them due
              to distance, time constraints, or mobility issues.
            </p>
            <p className="mt-4 text-[var(--rr-ink-dim)] leading-relaxed">
              Founded in 2024, we set out to create a platform that would bridge
              this gap. By partnering with local libraries across the country, we
              offer a convenient delivery service that brings the library to your
              doorstep.
            </p>
            <p className="mt-4 text-[var(--rr-ink-dim)] leading-relaxed">
              Today, we serve over 25,000 readers across 100+ cities, working
              with more than 50 partner libraries. Our goal is to make reading
              accessible, convenient, and enjoyable for everyone.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-80 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--rr-gold)]/20 to-[var(--rr-gold)]/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-32 w-32 text-[var(--rr-gold)]/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="border-t border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <h2 className="text-center text-3xl font-bold text-[var(--rr-ink)]">Our Values</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--rr-ink-dim)]">
            Everything we do is guided by our commitment to making knowledge
            accessible and supporting local communities.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6 transition-all hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--rr-gold)]/10 text-[var(--rr-gold)]">
                  {value.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--rr-ink)]">{value.title}</h3>
                <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold text-[var(--rr-ink)]">Meet Our Team</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--rr-ink-dim)]">
          The passionate people behind BiblioDrop who work tirelessly to connect
          readers with libraries.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--rr-gold)]/20 to-[var(--rr-gold)]/5 text-[var(--rr-gold)]">
                  <Users className="h-16 w-16" />
                </div>
              </div>
              <h3 className="mt-4 font-semibold text-[var(--rr-ink)]">{member.name}</h3>
              <p className="text-sm text-[var(--rr-ink-dim)]">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="rounded-3xl border border-[var(--rr-hairline)] bg-gradient-to-r from-[var(--rr-gold)]/10 to-[var(--rr-gold)]/5 p-10 text-center">
          <h2 className="text-3xl font-bold text-[var(--rr-ink)]">Join Our Community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--rr-ink-dim)]">
            Start exploring thousands of books from your local libraries today.
            Sign up now and get your first delivery free.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button color="primary" size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="bordered" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
