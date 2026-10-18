import { getTaskStatsController } from "@server/controllers/task.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return await getTaskStatsController();
}
