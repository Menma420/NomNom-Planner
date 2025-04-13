import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    console.log("📥 Incoming userId:", userId);

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { subscriptionActive: true },
    });

    console.log("📦 Fetched profile:", profile);

    if (!profile) {
      return NextResponse.json({ subscriptionActive: false }); // consistent response
    }

    return NextResponse.json({ subscriptionActive: profile.subscriptionActive ?? false });

  } catch (error) {
    console.error("❌ CHECK_SUBSCRIPTION_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
