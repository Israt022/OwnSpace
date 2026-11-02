import {
  getRoutineByIdController,
  updateRoutineController,
  deleteRoutineController,
} from "@server/controllers/routine.controller";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return await getRoutineByIdController(id);
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return await updateRoutineController(id, req);
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return await deleteRoutineController(id);
}
