"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Card,
  Input,
  Button,
  Checkbox,
} from "@heroui/react";

import { Lock, Mail } from "lucide-react";

import PasswordInput from "@/components/PasswordInput";
import GoogleButton from "@/components/GoogleButton";
import useLogin from "@/hooks/useLogin";
import { IoIosRadioButtonOff } from "react-icons/io";
import { TbCheckbox } from "react-icons/tb";
import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { loginUser, loading } = useLogin();

  const onSubmit = async (data) => {
    await loginUser(data);
  };

  // ====google login=====
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google Login failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google Login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="rounded-[36px] border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-8 md:p-10 shadow-none">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >


        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full rounded-2xl border py-4 pl-12 pr-4 outline-none"
            />
          </div>

          {errors.email && (
            <p className="mt-1 text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}

        <div className="">

          <div>


            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: 6,
                })}
                className="w-full rounded-2xl border py-4 pl-12 pr-4 outline-none"
              />
            </div>
          </div>
        </div>



        {/* Remember */}

        <div className="flex items-center justify-between">

          <Checkbox size="sm"> Remember me
          </Checkbox>

        </div>

        {/* Login */}

        <Button
          type="submit"
          radius="full"
          isLoading={loading}
          className="h-14 w-full bg-[#05081C] text-base font-semibold text-white hover:bg-black"
        >
          {loading ? "Signing In..." : "Login"}
        </Button>

        {/* Divider */}

        <div className="flex items-center gap-4">

          <div className="h-px flex-1 bg-[var(--rr-hairline)]"></div>

          <span className="text-sm text-zinc-400">
            or continue with
          </span>

          <div className="h-px flex-1 bg-[var(--rr-hairline)]"></div>

        </div>

        {/* Google */}

       
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-full border py-4 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />

          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        {/* Login */}

        <p className="text-center text-slate-500">
          Already have an account?{" "}
          <Link
            href="/register"
            className="text-sm font-semibold text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            Create an account
          </Link>
        </p>

      </form>

    </Card>
  );
}