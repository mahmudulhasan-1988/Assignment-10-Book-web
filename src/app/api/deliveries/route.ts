import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// GET /api/deliveries?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const url = userId
      ? `${BACKEND_URL}/api/deliveries?userId=${userId}`
      : `${BACKEND_URL}/api/deliveries`;

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
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

    const res = await fetch(`${BACKEND_URL}/api/deliveries`, {
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

    const res = await fetch(`${BACKEND_URL}/api/deliveries/${deliveryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateFields),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating delivery:", error);
    return NextResponse.json(
      { error: "Failed to update delivery" },
      { status: 500 }
    );
  }
}
