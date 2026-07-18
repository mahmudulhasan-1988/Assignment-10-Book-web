"use client";

import {
  Sparkles,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    text: "Readers can track active deliveries and reading history.",
  },
  {
    icon: BookOpen,
    text: "Librarians manage books and update request statuses.",
  },
  {
    icon: ShieldCheck,
    text: "Admins keep the ecosystem clean and verified.",
  },
];

export default function LoginLeftSection() {
  return (
    <div className="rounded-[36px] bg-[#070B1F] p-8 md:p-12 text-white flex flex-col justify-between min-h-[700px]">

      {/* Top */}
      <div>
        <p className="uppercase tracking-[6px] text-orange-400 text-sm font-medium">
          Welcome Back
        </p>

        <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-tight">
          Sign in to request
          <br />
          books, manage
          <br />
          inventory, or
          <br />
          approve
          <br />
          deliveries.
        </h1>

        
      </div>

      {/* Bottom Features */}
      <div className="mt-12 space-y-5">

        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-center gap-5 rounded-3xl bg-white/10 p-5 backdrop-blur-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Icon size={22} />
              </div>

              <p className="text-gray-200">
                {item.text}
              </p>
            </div>
          );
        })}

      </div>
    </div>
  );
}