import {
  getTasksController,
  createTaskController,
} from "@server/controllers/task.controller";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return await getTasksController(req);
}

export async function POST(req: Request) {
  return await createTaskController(req);
}
