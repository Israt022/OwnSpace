
import { NextResponse } from "next/server";
import prisma from "../../../../../server/src/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const [totalUsers, totalTasks, completedTasks] =
            await Promise.all([
                prisma.user.count(),
                prisma.task.count(),
                prisma.task.count({
                    where: { completed: true },
                }),
            ]);

        return NextResponse.json({
            success: true,
            data: {
                totalUsers,
                totalTasks,
                completedTasks,
            },
        });
    } catch (error) {
        console.error("Public stats API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to load platform statistics",
            },
            { status: 500 }
        );
    }
}
