import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// GET /api/books — fetch books with server-side pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract pagination params with defaults
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const db = await getDb();
    const collection = db.collection("books");

    // Build filter from query params
    const filter: Record<string, any> = {};
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const ownerId = searchParams.get("ownerId");

    if (category && category !== "All") {
      filter.category = category;
    }
    if (status) {
      filter.status = status;
    }
    if (ownerId) {
      filter.ownerId = ownerId;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "newest") sortObj = { createdAt: -1 };
    else if (sort === "oldest") sortObj = { createdAt: 1 };
    else if (sort === "price_low") sortObj = { deliveryFee: 1 };
    else if (sort === "price_high") sortObj = { deliveryFee: -1 };
    else if (sort === "rating") sortObj = { rating: -1 };
    else if (sort === "title_az") sortObj = { title: 1 };
    else if (sort === "title_za") sortObj = { title: -1 };

    const total = await collection.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;

    const books = await collection
      .find(filter)
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit)
      .toArray();

    // Convert _id to string and ensure required fields
    const serializedBooks = books.map((book) => ({
      ...book,
      _id: book._id.toString(),
      id: book._id.toString(),
      status: book.status || "pending",
      rating: book.rating || 0,
      totalReviews: book.totalReviews || 0,
      deliveryFee: book.deliveryFee || 0,
      description: book.description || "",
      isbn: book.isbn || "",
    }));

    return NextResponse.json({
      books: serializedBooks,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// POST /api/books — add a new book
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    const collection = db.collection("books");

    const newBook = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: body.rating || 0,
      totalReviews: body.totalReviews || 0,
    };

    const result = await collection.insertOne(newBook);

    return NextResponse.json(
      { ...newBook, _id: result.insertedId.toString(), id: result.insertedId.toString() },
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
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const { ObjectId } = await import("mongodb");
    const db = await getDb();
    const collection = db.collection("books");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...result,
      _id: result._id.toString(),
      id: result._id.toString(),
    });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const { ObjectId } = await import("mongodb");
    const db = await getDb();
    const collection = db.collection("books");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
