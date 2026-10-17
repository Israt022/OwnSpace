import { getUsersController } from "@server/controllers/user.controller";

export const dynamic = "force-dynamic";

/**
 * GET /api/users
 * Returns list of registered users.
 * Delegated to the user controller in server/src/controllers/user.controller.ts.
 */
export async function GET() {
  return await getUsersController();
}
