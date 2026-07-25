"use client";

import { Button, Input, TextArea } from "@heroui/react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: ["support@bibliodrop.com", "info@bibliodrop.com"],
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: ["+880 1811-562080", "+880 1700-123456"],
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      details: ["123 Library Street", "Dhaka, Bangladesh"],
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Working Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
    },
  ];

  const faqs = [
    {
      question: "How do I borrow a book?",
      answer:
        "Simply browse our collection, select the book you want, and place a delivery order. We'll deliver it to your doorstep within 24-48 hours.",
    },
    {
      question: "What are the delivery charges?",
      answer:
        "Delivery is free for orders above $20. For smaller orders, a nominal delivery fee of $2 applies.",
    },
    {
      question: "How long can I keep a book?",
      answer:
        "Standard borrowing period is 14 days. You can extend up to 3 times if no one else has reserved the book.",
    },
    {
      question: "Can I return books to any location?",
      answer:
        "Yes, you can return books at any of our partner library locations or schedule a pickup from your home.",
    },
  ];

  return (
    <main className="bg-[var(--rr-bg)]">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <span className="inline-flex rounded-full border border-[var(--rr-hairline)] px-4 py-1 text-sm font-medium text-[var(--rr-ink)]">
          Contact Us
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl text-[var(--rr-ink)]">
          Get in Touch
          <span className="block text-[var(--rr-gold)]">We&apos;re Here to Help</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--rr-ink-dim)]">
          Have questions about our service? Need help with an order? Our team is
          ready to assist you with anything you need.
        </p>
      </section>

      {/* Contact Info Cards */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info) => (
            <div
              key={info.title}
              className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6 text-center transition-all hover:shadow-lg"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--rr-gold)]/10 text-[var(--rr-gold)]">
                {info.icon}
              </div>
              <h3 className="mt-4 font-semibold text-[var(--rr-ink)]">{info.title}</h3>
              <div className="mt-2 space-y-1">
                {info.details.map((detail) => (
                  <p key={detail} className="text-sm text-[var(--rr-ink-dim)]">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-3xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--rr-ink)]">Send Us a Message</h2>
            <p className="mt-2 text-[var(--rr-ink-dim)]">
              Fill out the form below and we&apos;ll get back to you as soon as
              possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Input
                  label="Your Name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                label="Subject"
                name="subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <TextArea
                label="Message"
                name="message"
                placeholder="Tell us more about your inquiry..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />

              <Button type="submit" color="primary" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </div>

          {/* Map Placeholder */}
          <div className="flex flex-col gap-6">
            <div className="relative h-80 overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--rr-gold)]/20 to-[var(--rr-gold)]/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-16 w-16 text-[var(--rr-gold)]/40" />
                  <p className="mt-4 text-[var(--rr-ink-dim)]">
                    Interactive map coming soon
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="rounded-3xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6 shadow-sm">
              <h3 className="font-semibold text-[var(--rr-ink)]">Quick Contact</h3>
              <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
                For urgent inquiries, call us directly or send a WhatsApp
                message.
              </p>
              <div className="mt-4 flex gap-4">
                <Button color="primary" variant="flat" startContent={<Phone className="h-4 w-4" />}>
                  Call Now
                </Button>
                <Button variant="bordered" startContent={<Mail className="h-4 w-4" />}>
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-[var(--rr-hairline)] bg-[var(--rr-bg)]">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-center text-3xl font-bold text-[var(--rr-ink)]">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--rr-ink-dim)]">
            Find answers to common questions about our service.
          </p>

          <div className="mt-12 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
                <h3 className="font-semibold text-[var(--rr-ink)]">{faq.question}</h3>
                <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="rounded-3xl border border-[var(--rr-hairline)] bg-gradient-to-r from-[var(--rr-gold)]/10 to-[var(--rr-gold)]/5 p-10 text-center">
          <h2 className="text-3xl font-bold text-[var(--rr-ink)]">Ready to Start Reading?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--rr-ink-dim)]">
            Join thousands of readers who are already enjoying convenient library
            delivery.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="/register">
              <Button color="primary" size="lg">
                Sign Up Now
              </Button>
            </a>
            <a href="/books">
              <Button variant="bordered" size="lg">
                Browse Books
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
