"use client";

import RegisterLeftSection from "@/components/RegisterLeftSection";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Side */}
          <div className="rounded-[40px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-12">
            <RegisterLeftSection />
          </div>

          {/* Right Side */}
          <div className="rounded-[40px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-12">
            <RegisterForm />
          </div>

        </div>
      </div>
    </section>
  );
}