import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    // Test Redis connection
    const ping = await redis.ping();
    
    // Test setting and getting a value
    await redis.set('test-key', 'test-value', 'EX', 60);
    const testValue = await redis.get('test-key');
    
    return NextResponse.json({
      success: true,
      ping: ping,
      testValue: testValue,
      message: "Redis connection successful"
    });
  } catch (error) {
    console.error('Redis connection error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "Redis connection failed"
    }, { status: 500 });
  }
} 