import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { successResponse, errorResponse } from "@server/utils/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    return errorResponse("Unauthorized", 401);
  }

  return successResponse({
    user: sessionData.user,
  });
}
