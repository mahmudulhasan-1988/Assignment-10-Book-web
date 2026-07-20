import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verifyAuth } from "@/lib/verify-auth";

// POST /api/auth/change-password — change user password
export async function POST(request: NextRequest) {
  try {
    const session = await verifyAuth(request);

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new passwords are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Use better-auth's password update
    await auth.api.changePassword({
      headers: request.headers,
      body: {
        currentPassword,
        newPassword,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: error.message || "Failed to change password" },
      { status: 500 }
    );
  }
}
