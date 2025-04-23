import { getPriceIDFromType } from "@/lib/plans";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin");

    console.log(baseUrl);

    const { planType, userId, email } = await request.json();
    console.log("Checkout Request Body:", { planType, userId, email });    

    if (!planType || !userId || !email) {
      return NextResponse.json(
        { error: "Plan type, userId, email are required" },
        { status: 400 }
      );
    }

    const allowedPlanTypes = ["week", "month", "year"];
    if (!allowedPlanTypes.includes(planType)) {
      return NextResponse.json(
        { error: "Invalid plan type" },
        { status: 400 }
      );
    }

    // Debug: log the plan type and resulting price ID
    const priceID = getPriceIDFromType(planType);
    console.log("Plan Type:", planType, "Price ID:", priceID);

    if (!priceID) {
      return NextResponse.json(
        { error: "Invalid price id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceID,
          quantity: 1,
        },
      ],
      customer_email: email,
      mode: "subscription",
      metadata: { clerkUserId: userId, planType },
      success_url: `${baseUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscribe`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session creation error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
