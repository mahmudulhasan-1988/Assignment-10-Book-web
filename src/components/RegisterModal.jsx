"use client";

import {
  Modal,
  ModalContent,
  ModalBody,
} from "@heroui/react";

import { UserRound } from "lucide-react";
import { LibraryBig } from "lucide-react";
import { X } from "lucide-react";

import RegisterCard from "./RegisterCard";
import FloatingBooks from "./FloatingBooks";

export default function RegisterModal({
  isOpen,
  onOpenChange,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      placement="center"
      hideCloseButton
      backdrop="blur"
      classNames={{
        base: "bg-transparent shadow-none",
        backdrop:
          "bg-black/50 backdrop-blur-md",
      }}
    >
      <ModalContent>

        {(onClose) => (

          <ModalBody className="p-0">

            <div className="relative overflow-hidden rounded-[40px]">

              {/* Animated Background */}

              <FloatingBooks />

              {/* Glass */}

              <div
                className="
                relative
                bg-white/85
                backdrop-blur-3xl
                rounded-[40px]
                border
                border-white/60
                overflow-hidden
              "
              >

                {/* Close */}

                <button
                  onClick={onClose}
                  className="
                  absolute
                  top-6
                  right-6
                  w-11
                  h-11
                  rounded-full
                  bg-white
                  shadow-lg
                  flex
                  items-center
                  justify-center
                  hover:rotate-90
                  transition-all
                  duration-500
                  z-50
                "
                >
                  <X size={22} />
                </button>

                <div className="px-14 py-14">

                  <p
                    className="
                    uppercase
                    tracking-[6px]
                    text-orange-500
                    text-sm
                    font-semibold
                    mb-6
                  "
                  >
                    Create Account
                  </p>

                  <h1
                    className="
                    text-6xl
                    font-black
                    leading-tight
                    mb-6
                    max-w-4xl
                  "
                  >
                    How do you want to register?
                  </h1>

                  <p
                    className="
                    text-default-500
                    max-w-3xl
                    text-lg
                    leading-8
                    mb-14
                  "
                  >
                    Choose the account type first. We'll send
                    you to the register form with the role
                    already selected so you can continue using
                    Email or Google Sign In.
                  </p>

                  <div className="grid lg:grid-cols-2 gap-8">

                    <RegisterCard
                      icon={UserRound}
                      title="Register as User"
                      description="For readers who want to browse, request and review books."
                      href="/register?role=user"
                    />

                    <RegisterCard
                      icon={LibraryBig}
                      title="Register as Librarian"
                      description="For librarians who manage books, inventory and delivery requests."
                      href="/register?role=librarian"
                    />

                  </div>

                </div>

              </div>

            </div>

          </ModalBody>

        )}

      </ModalContent>
    </Modal>
  );
}