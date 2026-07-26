import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

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

    const db = await getDb();
    const collection = db.collection("reviews");

    const filter: Record<string, any> = {};
    if (bookId) filter.bookId = bookId;
    if (userId) filter.userId = userId;

    const reviews = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = reviews.map((r) => ({
      ...r,
      _id: r._id.toString(),
      id: r._id.toString(),
    })) as any[];

    // Compute avg rating for book reviews
    if (bookId) {
      const avgRating =
        serialized.length > 0
          ? serialized.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / serialized.length
          : 0;

      return NextResponse.json({
        reviews: serialized,
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews: serialized.length,
      });
    }

    return NextResponse.json({ reviews: serialized });
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
    const db = await getDb();
    const collection = db.collection("reviews");

    const newReview = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newReview);

    // Update book rating
    if (body.bookId) {
      const bookCollection = db.collection("reviews");
      const allReviews = await bookCollection.find({ bookId: body.bookId }).toArray();
      const avgRating =
        allReviews.length > 0
          ? allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.length
          : 0;

      const booksCollection = db.collection("books");
      try {
        await booksCollection.updateOne(
          { _id: new ObjectId(body.bookId) },
          {
            $set: {
              rating: Math.round(avgRating * 10) / 10,
              totalReviews: allReviews.length,
            },
          }
        );
      } catch {
        // Book might not exist or ID format differs
      }
    }

    return NextResponse.json(
      { ...newReview, _id: result.insertedId.toString(), id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// PUT /api/reviews — update a review
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

    const db = await getDb();
    const collection = db.collection("reviews");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(reviewId) },
      { $set: { rating, comment, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...result,
      _id: result._id.toString(),
      id: result._id.toString(),
    });
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

    const db = await getDb();
    const collection = db.collection("reviews");

    const result = await collection.deleteOne({ _id: new ObjectId(reviewId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
