"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function GoogleButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error(error);
      toast.error("Google Sign In Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="bordered"
      radius="lg"
      size="lg"
      onPress={handleGoogleLogin}
      isLoading={loading}
      className="w-full border-default-300 font-semibold"
    >
      {!loading && <FcGoogle size={22} className="mr-2" />}
      {loading ? "Signing In..." : "Continue with Google"}
    </Button>
  );
}