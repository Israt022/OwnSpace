import { getRoutineStatsController } from "@server/controllers/routine.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return await getRoutineStatsController();
}

