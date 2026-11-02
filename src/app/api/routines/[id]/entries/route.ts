import { createEntryController } from "@server/controllers/routine-entry.controller";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return await createEntryController(id, req);
}

