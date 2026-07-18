"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function useLogin() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const loginUser = async (formData) => {
    try {
      setLoading(true);

      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success("Login Successful");

      router.push("/");

      return true;
    } catch (error) {
      console.error(error);
      toast.error("Login Failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loginUser,
    loading,
  };
}