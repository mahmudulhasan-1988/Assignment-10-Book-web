import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/verify-auth";
import { ObjectId } from "mongodb";

interface ReadingListDocument {
  _id?: ObjectId;
  userId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  category: string;
  addedAt: Date;
}

// GET /api/reading-list?userId=xxx — fetch user's reading list
export async function GET(request: NextRequest) {
  try {
    const session = await verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || session.user.id;

    const db = await getDb();
    const collection = db.collection<ReadingListDocument>("readingList");

    const items = await collection
      .find({ userId })
      .sort({ addedAt: -1 })
      .toArray();

    const mapped = items.map((item) => ({
      ...item,
      _id: item._id?.toString() || "",
      addedAt: item.addedAt?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json(mapped);
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
    const session = await verifyAuth(request);

    const body = await request.json();
    const { bookId, bookTitle, bookAuthor, bookCover, category } = body;

    if (!bookId || !bookTitle) {
      return NextResponse.json(
        { error: "Book ID and title are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<ReadingListDocument>("readingList");

    // Check if already in reading list
    const existing = await collection.findOne({
      userId: session.user.id,
      bookId,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Book already in reading list" },
        { status: 409 }
      );
    }

    const item: ReadingListDocument = {
      userId: session.user.id,
      bookId,
      bookTitle,
      bookAuthor: bookAuthor || "",
      bookCover: bookCover || "",
      category: category || "",
      addedAt: new Date(),
    };

    const result = await collection.insertOne(item);

    return NextResponse.json(
      { ...item, _id: result.insertedId.toString(), addedAt: item.addedAt.toISOString() },
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

// DELETE /api/reading-list?bookId=xxx — remove from reading list
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<ReadingListDocument>("readingList");

    const result = await collection.deleteOne({
      userId: session.user.id,
      bookId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Book not found in reading list" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from reading list:", error);
    return NextResponse.json(
      { error: "Failed to remove from reading list" },
      { status: 500 }
    );
  }
}
