import {
  updateTaskController,
  deleteTaskController,
} from "@server/controllers/task.controller";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return await updateTaskController(id, req);
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return await deleteTaskController(id);
}
