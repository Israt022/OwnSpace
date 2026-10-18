import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import {
  getAdminPlatformStats,
  getAdminUsersList,
  updateUserRole,
} from "../services/admin.service";
import { successResponse, errorResponse } from "../utils/api-response";

/**
 * Controller to get system-wide metrics (Admins only).
 */
export async function getAdminStatsController(): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    if (sessionData.user.role !== "ADMIN") {
      return errorResponse("Forbidden: Admin privileges required", 403);
    }

    const stats = await getAdminPlatformStats();
    return successResponse(stats, 200);
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return errorResponse("Failed to fetch admin stats", 500);
  }
}

/**
 * Controller to list users for admin user management (Admins only).
 */
export async function getAdminUsersController(req: Request): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    if (sessionData.user.role !== "ADMIN") {
      return errorResponse("Forbidden: Admin privileges required", 403);
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const role = searchParams.get("role") || undefined;

    const users = await getAdminUsersList(search, role);
    return successResponse(users, 200);
  } catch (error) {
    console.error("Failed to fetch admin users:", error);
    return errorResponse("Failed to fetch admin users", 500);
  }
}

/**
 * Controller to update user role (Admins only).
 */
export async function updateUserRoleController(
  targetUserId: string,
  req: Request
): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    if (sessionData.user.role !== "ADMIN") {
      return errorResponse("Forbidden: Admin privileges required", 403);
    }

    const body = await req.json();
    const { role } = body as { role?: "USER" | "ADMIN" };

    if (!role || (role !== "USER" && role !== "ADMIN")) {
      return errorResponse("Valid role ('USER' or 'ADMIN') is required", 400);
    }

    const updated = await updateUserRole(targetUserId, role);
    return successResponse(updated, 200);
  } catch (error) {
    console.error("Failed to update user role:", error);
    return errorResponse("Failed to update user role", 500);
  }
}
