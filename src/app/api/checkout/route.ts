import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    const body = await request.json().catch(() => ({}));
    const {
      bookTitle = "Book Delivery",
      deliveryFee = 5,
      bookCover = "",
      bookId = "",
    } = body;

    const numericFee = parseFloat(deliveryFee) || 5;
    // Amount in cents (USD)
    const unitAmount = Math.max(50, Math.round(numericFee * 100));

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Book Delivery: ${bookTitle}`,
            description: `Delivery subscription for ${bookTitle}`,
            images: bookCover ? [bookCover] : [],
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/pricing/success-subscription?session_id={CHECKOUT_SESSION_ID}&bookId=${bookId}&deliveryFee=${numericFee}`,
      cancel_url: `${origin}/books`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout creation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
