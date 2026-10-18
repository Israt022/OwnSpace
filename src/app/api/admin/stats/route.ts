import { getAdminStatsController } from "@server/controllers/admin.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return await getAdminStatsController();
}
