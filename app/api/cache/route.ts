import { NextRequest, NextResponse } from "next/server";
import { CacheService } from "@/lib/redis";

const cacheService = new CacheService();

// GET - Get cache statistics
export async function GET() {
  try {
    const stats = await cacheService.getStats();
    return NextResponse.json({
      success: true,
      stats,
      message: "Cache statistics retrieved successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get cache statistics" },
      { status: 500 }
    );
  }
}

// DELETE - Clear all cache
export async function DELETE() {
  try {
    await cacheService.clear();
    return NextResponse.json({
      success: true,
      message: "Cache cleared successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear cache" },
      { status: 500 }
    );
  }
} 