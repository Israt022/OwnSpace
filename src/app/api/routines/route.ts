import {
  getRoutinesController,
  createRoutineController,
} from "@server/controllers/routine.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return await getRoutinesController();
}

export async function POST(req: Request) {
  return await createRoutineController(req);
}
