import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/books/[id] — fetch a single book
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const collection = db.collection("books");

    let book;
    if (ObjectId.isValid(id)) {
      book = await collection.findOne({ _id: new ObjectId(id) });
    } else {
      book = await collection.findOne({ id });
    }

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    // Map _id to id
    const mapped = {
      ...book,
      id: book._id?.toString() || "",
    };

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}
