import { NextResponse } from "next/server";
import { getAllUsers, getUserById } from "../services/user.service";
import { successResponse, errorResponse } from "../utils/api-response";
import { validateUserId } from "../validators/user.validator";

/**
 * Controller to fetch all registered users.
 * Replaces the previous Express getUsers handler while keeping the exact response schema.
 */
export async function getUsersController(): Promise<NextResponse> {
  try {
    const users = await getAllUsers();
    return successResponse(users, 200);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return errorResponse(
      "Failed to fetch users",
      500,
      error instanceof Error ? error.message : undefined
    );
  }
}

/**
 * Controller to fetch a single user by ID.
 */
export async function getUserByIdController(id: string): Promise<NextResponse> {
  try {
    const validatedId = validateUserId(id);
    const user = await getUserById(validatedId);

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user, 200);
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    const message = error instanceof Error ? error.message : "Failed to fetch user";
    return errorResponse(message, 400);
  }
}