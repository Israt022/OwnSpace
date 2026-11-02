import {
  updateEntryController,
  deleteEntryController,
} from "@server/controllers/routine-entry.controller";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return await updateEntryController(id, req);
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return await deleteEntryController(id);
}

