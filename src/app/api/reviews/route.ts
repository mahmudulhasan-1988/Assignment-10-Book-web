import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/verify-auth";
import { ObjectId } from "mongodb";

interface ReviewDocument {
  _id?: ObjectId;
  userId: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  bookId: string;
  bookTitle: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Recalculate and update a book's average rating and total reviews
async function updateBookRating(bookId: string) {
  const db = await getDb();
  const reviewsCollection = db.collection<ReviewDocument>("reviews");
  const booksCollection = db.collection("books");

  const reviews = await reviewsCollection.find({ bookId }).toArray();
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  await booksCollection.updateOne(
    { _id: new ObjectId(bookId) },
    { $set: { rating: Math.round(avgRating * 10) / 10, totalReviews: reviews.length, updatedAt: new Date() } }
  );
}

// GET /api/reviews?bookId=xxx or ?userId=xxx — fetch reviews for a book or by a user
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<ReviewDocument>("reviews");

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const userId = searchParams.get("userId");

    const filter: Record<string, string> = {};
    if (bookId) filter.bookId = bookId;
    if (userId) filter.userId = userId;

    if (!bookId && !userId) {
      return NextResponse.json(
        { error: "bookId or userId is required" },
        { status: 400 }
      );
    }

    const reviews = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({ reviews, avgRating, totalReviews: reviews.length });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// PUT /api/reviews — update a review
export async function PUT(request: NextRequest) {
  try {
    const session = await verifyAuth(request);

    const body = await request.json();
    const { reviewId, rating, comment } = body;

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<ReviewDocument>("reviews");

    const updateFields: Record<string, unknown> = { updatedAt: new Date() };
    if (rating !== undefined) updateFields.rating = rating;
    if (comment !== undefined) updateFields.comment = comment;

    const result = await collection.updateOne(
      { _id: new ObjectId(reviewId), userId: session.user.id },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Review not found or unauthorized" },
        { status: 404 }
      );
    }

    const updated = await collection.findOne({ _id: new ObjectId(reviewId) });
    if (updated?.bookId) await updateBookRating(updated.bookId);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// POST /api/reviews — create a review
export async function POST(request: NextRequest) {
  try {
    const session = await verifyAuth(request);

    const body = await request.json();
    const { bookId, bookTitle, rating, comment } = body;

    if (!bookId || !rating) {
      return NextResponse.json(
        { error: "Book ID and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<ReviewDocument>("reviews");

    // Check if user already reviewed this book
    const existing = await collection.findOne({
      userId: session.user.id,
      bookId,
    });

    if (existing) {
      // Update existing review
      const result = await collection.updateOne(
        { _id: existing._id },
        {
          $set: {
            rating,
            comment: comment || "",
            updatedAt: new Date(),
          },
        }
      );

      const updated = await collection.findOne({ _id: existing._id });
      await updateBookRating(bookId);
      return NextResponse.json(updated);
    }

    const now = new Date();
    const review: ReviewDocument = {
      userId: session.user.id,
      userName: session.user.name || "Anonymous",
      userEmail: session.user.email || "",
      userImage: (session.user as any).image || "",
      bookId,
      bookTitle: bookTitle || "",
      rating,
      comment: comment || "",
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(review);

    await updateBookRating(bookId);

    return NextResponse.json(
      { ...review, _id: result.insertedId },
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

// DELETE /api/reviews — delete a review
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<ReviewDocument>("reviews");

    // Find the review first to get bookId
    const review = await collection.findOne({
      _id: new ObjectId(reviewId),
      userId: session.user.id,
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found or unauthorized" },
        { status: 404 }
      );
    }

    await collection.deleteOne({ _id: new ObjectId(reviewId) });
    await updateBookRating(review.bookId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
