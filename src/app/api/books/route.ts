import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/verify-auth";
import { ObjectId } from "mongodb";

interface BookDocument {
  _id?: ObjectId;
  title: string;
  author: string;
  category: string;
  description: string;
  deliveryFee: number;
  coverImage: string;
  status: "available" | "checked_out" | "pending";
  rating: number;
  totalReviews: number;
  isbn: string;
  publishedYear: number;
  ownerId?: string;
  ownerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

// GET /api/books — fetch all books with optional filters
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<BookDocument>("books");

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "newest";

    let query: any = {};

    // Text search on title, author, category
    if (search) {
      const regex = { $regex: search, $options: "i" };
      query.$or = [
        { title: regex },
        { author: regex },
        { category: regex },
        { description: regex },
      ];
    }

    // Category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Sort
    let sortOption: any = {};
    switch (sort) {
      case "newest":
        sortOption = { publishedYear: -1 };
        break;
      case "oldest":
        sortOption = { publishedYear: 1 };
        break;
      case "price_low":
        sortOption = { deliveryFee: 1 };
        break;
      case "price_high":
        sortOption = { deliveryFee: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "title_az":
        sortOption = { title: 1 };
        break;
      case "title_za":
        sortOption = { title: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const books = await collection.find(query).sort(sortOption).toArray();

    // Map _id to id for frontend compatibility
    const mapped = books.map((book) => ({
      ...book,
      id: book._id?.toString() || "",
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// POST /api/books — add a new book (librarian/admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await verifyAuth(request);

    const body = await request.json();
    const {
      title,
      author,
      category,
      description,
      deliveryFee,
      coverImage,
      isbn,
      publishedYear,
    } = body;

    if (!title || !author) {
      return NextResponse.json(
        { error: "Title and author are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<BookDocument>("books");

    const now = new Date();
    const book: BookDocument = {
      title,
      author,
      category: category || "Fiction",
      description: description || "",
      deliveryFee: deliveryFee || 0,
      coverImage: coverImage || "",
      status: "pending",
      rating: 0,
      totalReviews: 0,
      isbn: isbn || "",
      publishedYear: publishedYear || now.getFullYear(),
      ownerId: session.user.id,
      ownerName: session.user.name || "Unknown",
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(book);

    return NextResponse.json(
      { ...book, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}

// PUT /api/books — update a book
export async function PUT(request: NextRequest) {
  try {
    const session = await verifyAuth(request);

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<BookDocument>("books");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

// DELETE /api/books?id=xxx — delete a book
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<BookDocument>("books");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
