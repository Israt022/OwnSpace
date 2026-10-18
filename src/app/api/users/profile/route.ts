import { getServerSession } from "@/lib/session";
import { updateUserProfile } from "@server/services/user.service";
import { successResponse, errorResponse } from "@server/utils/api-response";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const { name, image } = body as { name?: string; image?: string | null };

    if (name !== undefined && name.trim().length < 2) {
      return errorResponse("Name must be at least 2 characters", 400);
    }

    const updated = await updateUserProfile(sessionData.user.id, {
      name,
      image,
    });

    return successResponse(updated, 200);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return errorResponse("Failed to update profile", 500);
  }
}
