"use client";

import { useState } from "react";
import { Input } from "@heroui/react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  register,
  errors,
  name = "password",
  label = "Password",
  placeholder = "Enter your password",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full space-y-2">
      {/* Label */}
      <label
        htmlFor={name}
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>

      {/* Password Input */}
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <Input
          id={name}
          {...register(name, {
            required: `${label} is required`,
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          variant="bordered"
          radius="lg"
          size="lg"
          className="pl-10 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-400 transition hover:text-black dark:hover:text-white"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Error Message */}
      {errors?.[name] && (
        <p className="text-sm text-red-500">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}