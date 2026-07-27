import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

// GET /api/deliveries?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const db = await getDb();
    const collection = db.collection("deliveries");

    const filter: Record<string, any> = {};
    if (userId) {
      filter.userId = userId;
    }

    const deliveries = await collection
      .find(filter)
      .sort({ requestDate: -1 })
      .toArray();

    const serialized = deliveries.map((d) => ({
      ...d,
      _id: d._id.toString(),
      id: d._id.toString(),
    }));

    return NextResponse.json(serialized);
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
    const body = await request.json();
    const db = await getDb();
    const collection = db.collection("deliveries");

    const newDelivery = {
      ...body,
      status: body.status || "Pending",
      paymentStatus: body.paymentStatus || "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      requestDate: body.requestDate || new Date().toISOString(),
    };

    const result = await collection.insertOne(newDelivery);

    return NextResponse.json(
      { ...newDelivery, _id: result.insertedId.toString(), id: result.insertedId.toString() },
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

// PATCH /api/deliveries — update delivery fields
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { deliveryId, ...updateFields } = body;

    if (!deliveryId) {
      return NextResponse.json(
        { error: "Delivery ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("deliveries");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(deliveryId) },
      { $set: { ...updateFields, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...result,
      _id: result._id.toString(),
      id: result._id.toString(),
    });
  } catch (error) {
    console.error("Error updating delivery:", error);
    return NextResponse.json(
      { error: "Failed to update delivery" },
      { status: 500 }
    );
  }
}
