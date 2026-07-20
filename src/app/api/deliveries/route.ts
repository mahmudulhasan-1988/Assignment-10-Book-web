import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/verify-auth";
import { ObjectId } from "mongodb";

interface DeliveryDocument {
  _id?: ObjectId;
  userId: string;
  userName: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  deliveryFee: number;
  status: "Pending" | "Dispatched" | "Delivered";
  requestDate: Date;
  updatedAt: Date;
}

// GET /api/deliveries?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<DeliveryDocument>("deliveries");

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let query = {};
    if (userId) {
      query = { userId };
    }

    const deliveries = await collection
      .find(query)
      .sort({ requestDate: -1 })
      .toArray();

    return NextResponse.json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return NextResponse.json(
      { error: "Failed to fetch deliveries" },
      { status: 500 }
    );
  }
}

// POST /api/deliveries
export async function POST(request: NextRequest) {
  try {
    const session = await verifyAuth(request);

    const body = await request.json();
    const { bookId, bookTitle, bookAuthor, bookCover, deliveryFee } = body;

    if (!bookId || !bookTitle) {
      return NextResponse.json(
        { error: "Book ID and title are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<DeliveryDocument>("deliveries");

    // Check if user already has a pending delivery for this book
    const existing = await collection.findOne({
      userId: session.user.id,
      bookId,
      status: { $in: ["Pending", "Dispatched"] },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already have an active delivery request for this book" },
        { status: 409 }
      );
    }

    const now = new Date();
    const delivery: DeliveryDocument = {
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      userEmail: session.user.email || "",
      bookId,
      bookTitle,
      bookAuthor: bookAuthor || "",
      bookCover: bookCover || "",
      deliveryFee: deliveryFee || 0,
      status: "Pending",
      requestDate: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(delivery);

    return NextResponse.json(
      { ...delivery, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating delivery:", error);
    return NextResponse.json(
      { error: "Failed to create delivery request" },
      { status: 500 }
    );
  }
}

// PATCH /api/deliveries — update delivery status (for librarians)
export async function PATCH(request: NextRequest) {
  try {
    const session = await verifyAuth(request);

    const body = await request.json();
    const { deliveryId, status } = body;

    if (!deliveryId || !status) {
      return NextResponse.json(
        { error: "Delivery ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["Pending", "Dispatched", "Delivered"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<DeliveryDocument>("deliveries");

    const result = await collection.updateOne(
      { _id: new ObjectId(deliveryId) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Delivery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating delivery:", error);
    return NextResponse.json(
      { error: "Failed to update delivery" },
      { status: 500 }
    );
  }
}
