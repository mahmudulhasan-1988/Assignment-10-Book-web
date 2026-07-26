import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET /api/reading-list?userId=xxx — fetch user's reading list
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("readingList");

    const items = await collection
      .find({ userId })
      .sort({ addedAt: -1 })
      .toArray();

    const serialized = items.map((item) => ({
      ...item,
      _id: item._id.toString(),
      id: item._id.toString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Error fetching reading list:", error);
    return NextResponse.json(
      { error: "Failed to fetch reading list" },
      { status: 500 }
    );
  }
}

// POST /api/reading-list — add book to reading list
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    const collection = db.collection("readingList");

    // Check for duplicates
    const existing = await collection.findOne({
      userId: body.userId,
      bookId: body.bookId,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Book already in reading list" },
        { status: 409 }
      );
    }

    const newItem = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newItem);

    return NextResponse.json(
      { ...newItem, _id: result.insertedId.toString(), id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to reading list:", error);
    return NextResponse.json(
      { error: "Failed to add to reading list" },
      { status: 500 }
    );
  }
}

// DELETE /api/reading-list?bookId=xxx&userId=xxx — remove from reading list
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const userId = searchParams.get("userId");

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("readingList");

    const filter: Record<string, any> = { bookId };
    if (userId) {
      filter.userId = userId;
    }

    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Removed from reading list" });
  } catch (error) {
    console.error("Error removing from reading list:", error);
    return NextResponse.json(
      { error: "Failed to remove from reading list" },
      { status: 500 }
    );
  }
}
