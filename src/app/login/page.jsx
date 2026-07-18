// import { useForm } from "react-hook-form";
import useLogin from "@/hooks/useLogin";

// import LoginForm from "@/components/LoginForm";
import LoginLeftSection from "@/components/LoginLeftSection";

import Link from "next/link";

import { Card, CardHeader, CardContent as CardBody, Input, Button, Label, Form } from "@heroui/react";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
// import Logo from "@/components/Logo";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
// import { useForm } from "react-hook-form";

export const metadata = {
  title: "Login | BiblioDrop",
  description: "Login to your BiblioDrop account",
};


    // const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {

        const { data: signInData, error: signInError } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
        })

        console.log(signInData, signInError);

        if (signInError) {
            toast.error("Registration not succeed...")
        }
        else {
            redirect("/")
        }


    }

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Side */}
          <LoginLeftSection />

          {/* Right Side */}
          <LoginForm />
        </div>
      </div>
    </main>
  );
}