"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Upload } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/utils/uploadImage";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      // Password Match Check
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      let imageUrl = "";

      // Upload image if selected
      if (data.image?.length > 0) {
        imageUrl = await uploadImage(data.image[0]);
      }

      const { data: signUpData, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        image: imageUrl,
        role: data.role,
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      toast.success("Registration Successful 🎉");

      reset();

      // Redirect to Home
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="rounded-[40px] border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-8 lg:p-10 shadow-sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Name & Role */}
        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Your Full Name"
                {...register("name", {
                  required: "Name is required",
                })}
                className="w-full rounded-2xl border py-4 pl-12 pr-4 outline-none"
              />
            </div>

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Role
            </label>

            <select
              {...register("role")}
              className="w-full rounded-2xl border py-4 px-4 outline-none"
            >
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
              <option value="reader">Reader</option>
            </select>
          </div>

        </div>

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
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="grid md:grid-cols-2 gap-5">

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
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                className="w-full rounded-2xl border py-4 pl-12 pr-4 outline-none"
              />
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="w-full rounded-2xl border py-4 pl-12 pr-4 outline-none"
              />
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

        </div>

        {/* Image */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Profile Image
          </label>

          <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-5">

            <Upload size={18} />

            <span>Upload Image</span>

            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="hidden"
            />

          </label>
        </div>

        {/* Register */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#05081C] py-4 font-semibold text-white hover:bg-black disabled:opacity-60"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200"></div>

          <span className="text-sm text-slate-400">
            or continue with
          </span>

          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        {/* Google */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-full border py-4 hover:bg-slate-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />

          Continue with Google
        </button>

        {/* Login */}
        <p className="text-center text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-black hover:underline"
          >
            Sign In
          </Link>
        </p>

      </form>
    </motion.div>
  );
}