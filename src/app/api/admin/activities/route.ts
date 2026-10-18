import { getServerSession } from "@/lib/session";
import { getAdminActivities } from "@server/services/admin.service";
import { successResponse, errorResponse } from "@server/utils/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    if (sessionData.user.role !== "ADMIN") {
      return errorResponse("Forbidden: Admin privileges required", 403);
    }

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 30;

    const activities = await getAdminActivities(limit);
    return successResponse(activities, 200);
  } catch (error) {
    console.error("Failed to fetch admin activities:", error);
    return errorResponse("Failed to fetch admin activities", 500);
  }
}
