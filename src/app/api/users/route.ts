import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

// GET /api/users — Get all users
export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("user");

    const users = await collection.find({}).toArray();

    const mapped = users.map((user: any) => ({
      id: user._id?.toString() || "",
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
      role: user.role || "reader",
      createdAt: user.createdAt,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// PATCH /api/users — Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, role, name, image } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update name or image via better-auth API (updates JWT/session too)
    if (name !== undefined || image !== undefined) {
      const updates: Record<string, any> = {};
      if (name !== undefined) updates.name = name;
      if (image !== undefined) updates.image = image;

      await auth.api.updateUser({
        headers: request.headers,
        body: updates,
      });
    }

    // Update role via MongoDB directly (admin-only action)
    if (role !== undefined) {
      const validRoles = ["admin", "librarian", "reader"];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: "Invalid role" },
          { status: 400 }
        );
      }

      const db = await getDb();
      const collection = db.collection("user");
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { role, updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users — Delete user
export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection("user");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
