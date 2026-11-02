import {
  getRoutinesController,
  createRoutineController,
} from "@server/controllers/routine.controller";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return await getRoutinesController(req);
}

export async function POST(req: Request) {
  return await createRoutineController(req);
}

