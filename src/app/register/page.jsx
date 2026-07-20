"use client";

import RegisterLeftSection from "@/components/RegisterLeftSection";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="min-h-screen bg-[var(--rr-bg)] py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Side */}
          <div className="rounded-[40px] border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-8 md:p-12">
            <RegisterLeftSection />
          </div>

          {/* Right Side */}
          <div className="rounded-[40px] border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-8 md:p-12">
            <RegisterForm />
          </div>

        </div>
      </div>
    </section>
  );
}