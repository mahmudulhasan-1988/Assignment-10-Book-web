"use client";

import Link from "next/link";
import { Card, CardBody } from "@heroui/react";
import { ArrowRight } from "lucide-react";

export default function RegisterCard({
  icon: Icon,
  title,
  description,
  href,
}) {
  return (
    <Link href={href} className="group">
      <Card
        shadow="none"
        className="
        h-full
        border
        border-default-200
        bg-white/70
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-2
        hover:shadow-2xl
        hover:border-primary
        rounded-3xl
      "
      >
        <CardBody className="p-8">

          <div
            className="
            w-16
            h-16
            rounded-2xl
            bg-black
            text-white
            flex
            items-center
            justify-center
            mb-8
            transition-all
            duration-500
            group-hover:scale-110
            group-hover:rotate-6
          "
          >
            <Icon size={30} />
          </div>

          <h2 className="text-3xl font-bold mb-4">
            {title}
          </h2>

          <p className="text-default-500 leading-8 mb-10">
            {description}
          </p>

          <div
            className="
            inline-flex
            items-center
            gap-2
            font-semibold
            text-black
            transition-all
            duration-300
            group-hover:gap-4
          "
          >
            Continue
            <ArrowRight size={18} />
          </div>

        </CardBody>
      </Card>
    </Link>
  );
}