import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

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

    const res = await fetch(`${BACKEND_URL}/api/reading-list?userId=${userId}`);
    const data = await res.json();

    return NextResponse.json(data);
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

    const res = await fetch(`${BACKEND_URL}/api/reading-list`, {
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
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const userId = searchParams.get("userId");

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const url = userId
      ? `${BACKEND_URL}/api/reading-list?bookId=${bookId}&userId=${userId}`
      : `${BACKEND_URL}/api/reading-list?bookId=${bookId}`;

    const res = await fetch(url, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error removing from reading list:", error);
    return NextResponse.json(
      { error: "Failed to remove from reading list" },
      { status: 500 }
    );
  }
}
