import { updateUserRoleController } from "@server/controllers/admin.controller";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return await updateUserRoleController(id, req);
}
