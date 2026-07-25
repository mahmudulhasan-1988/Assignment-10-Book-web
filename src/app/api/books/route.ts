import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// GET /api/books — fetch books with server-side pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract pagination params with defaults
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    // Build query string for backend
    const backendParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "page" && key !== "limit") {
        backendParams.set(key, value);
      }
    });
    backendParams.set("page", page.toString());
    backendParams.set("limit", limit.toString());

    const queryString = backendParams.toString();
    const url = `${BACKEND_URL}/api/books${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url);
    const data = await res.json();

    // If backend returns paginated response
    if (data.books && data.pagination) {
      return NextResponse.json(data);
    }

    // If backend returns plain array, handle pagination here
    if (Array.isArray(data)) {
      const total = data.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedBooks = data.slice(startIndex, startIndex + limit);

      return NextResponse.json({
        books: paginatedBooks,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    }

    // Fallback: wrap data
    return NextResponse.json({
      books: Array.isArray(data) ? data : [data],
      pagination: {
        page: 1,
        limit,
        total: Array.isArray(data) ? data.length : 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
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

    const res = await fetch(`${BACKEND_URL}/api/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
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

    const res = await fetch(`${BACKEND_URL}/api/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
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

    const res = await fetch(`${BACKEND_URL}/api/books/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
