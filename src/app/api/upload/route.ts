import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// POST /api/upload — upload an image file
export async function POST(request: NextRequest) {
  try {
    console.log("[Upload] Request received");

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      console.log("[Upload] No file provided");
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    console.log(`[Upload] File: ${file.name}, type: ${file.type}, size: ${file.size}`);

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      console.log(`[Upload] Invalid type: ${file.type}`);
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log(`[Upload] File too large: ${file.size}`);
      return NextResponse.json(
        { error: "File size must be under 5MB" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    console.log(`[Upload] Dir: ${uploadsDir}`);

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const uniqueId = crypto.randomUUID();
    const filename = `profile-${uniqueId}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));
    console.log(`[Upload] Written: ${filepath}`);

    // Return the public URL
    const url = `/uploads/${filename}`;
    console.log(`[Upload] Success: ${url}`);

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("[Upload] Error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
