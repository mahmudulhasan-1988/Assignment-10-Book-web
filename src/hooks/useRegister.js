"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/utils/uploadImage";

export default function useRegister() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const registerUser = async (formData) => {
    try {
      setLoading(true);

      // Upload Profile Image
      const imageUrl = await uploadImage(formData.image[0]);

      if (!imageUrl) {
        toast.error("Image upload failed.");
        return;
      }

      // Better Auth Register
      const { error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: imageUrl,
        role: formData.role,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Registration Successful!");

      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return {
    registerUser,
    loading,
  };
}