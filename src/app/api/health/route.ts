import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Health check endpoint for monitoring application status.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "ownspace",
  });
}
