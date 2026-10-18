import { getAdminUsersController } from "@server/controllers/admin.controller";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return await getAdminUsersController(req);
}
