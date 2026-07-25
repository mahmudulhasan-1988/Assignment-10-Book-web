import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// GET /api/reviews?bookId=xxx or ?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const userId = searchParams.get("userId");

    if (!bookId && !userId) {
      return NextResponse.json(
        { error: "bookId or userId is required" },
        { status: 400 }
      );
    }

    // If bookId is provided, fetch by bookId directly
    if (bookId) {
      const url = `${BACKEND_URL}/api/reviews?bookId=${bookId}`;
      const res = await fetch(url);
      const data = await res.json();
      return NextResponse.json(data);
    }

    // If userId is provided, fetch reviews for all books the user has interacted with
    // First get the user's deliveries to find bookIds, then fetch reviews for each
    try {
      const deliveriesRes = await fetch(`${BACKEND_URL}/api/deliveries?userId=${userId}`);
      const deliveries = deliveriesRes.ok ? await deliveriesRes.json() : [];

      // Get unique bookIds from deliveries
      const bookIds = [...new Set(deliveries.map((d: any) => d.bookId).filter(Boolean))];

      if (bookIds.length === 0) {
        return NextResponse.json({ reviews: [], avgRating: 0, totalReviews: 0 });
      }

      // Fetch reviews for each bookId in parallel
      const reviewPromises = bookIds.map(async (bid: string) => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/reviews?bookId=${bid}`);
          if (!res.ok) return [];
          const data = await res.json();
          return data.reviews || [];
        } catch {
          return [];
        }
      });

      const reviewArrays = await Promise.all(reviewPromises);
      const allReviews = reviewArrays.flat();

      // Filter by userId
      const filtered = allReviews.filter((r: any) => r.userId === userId);

      const avgRating =
        filtered.length > 0
          ? filtered.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / filtered.length
          : 0;

      return NextResponse.json({
        reviews: filtered,
        avgRating,
        totalReviews: filtered.length,
      });
    } catch {
      return NextResponse.json({ reviews: [], avgRating: 0, totalReviews: 0 });
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/reviews — create a review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
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
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// PUT /api/reviews — update a review (proxy to DELETE + POST since backend doesn't have PUT)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, rating, comment } = body;

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    // Delete old review and create new one (simplified approach)
    const deleteRes = await fetch(`${BACKEND_URL}/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (!deleteRes.ok) {
      const data = await deleteRes.json();
      return NextResponse.json(data, { status: deleteRes.status });
    }

    // Create new review with updated data
    const createRes = await fetch(`${BACKEND_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        reviewId: undefined,
      }),
    });

    const data = await createRes.json();

    if (!createRes.ok) {
      return NextResponse.json(data, { status: createRes.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews?id=xxx — delete a review
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
