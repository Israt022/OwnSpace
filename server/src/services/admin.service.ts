import prisma from "../lib/prisma";

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalRegularUsers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  systemCompletionRate: number;
  recentTasksCount: number;
  urgentTasksCount: number;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  createdAt: Date;
  totalTasks: number;
  completedTasks: number;
}

/**
 * Fetch platform-wide stats for the Admin Dashboard.
 */
export async function getAdminPlatformStats(): Promise<AdminStats> {
  const [users, tasks] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        role: true,
      },
    }),
    prisma.task.findMany({
      select: {
        id: true,
        completed: true,
        priority: true,
        createdAt: true,
      },
    }),
  ]);

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "ADMIN").length;
  const totalRegularUsers = totalUsers - totalAdmins;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const systemCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentTasksCount = tasks.filter((t) => new Date(t.createdAt) >= oneDayAgo).length;
  const urgentTasksCount = tasks.filter((t) => !t.completed && (t.priority === "HIGH" || t.priority === "URGENT")).length;

  return {
    totalUsers,
    totalAdmins,
    totalRegularUsers,
    totalTasks,
    completedTasks,
    pendingTasks,
    systemCompletionRate,
    recentTasksCount,
    urgentTasksCount,
  };
}

/**
 * Fetch all users with their task counts and details for Admin user management table.
 */
export async function getAdminUsersList(
  search?: string,
  roleFilter?: string
): Promise<AdminUserItem[]> {
  const where: Record<string, unknown> = {};

  if (roleFilter && (roleFilter === "USER" || roleFilter === "ADMIN")) {
    where.role = roleFilter;
  }

  if (search && search.trim()) {
    where.OR = [
      { name: { contains: search.trim(), mode: "insensitive" } },
      { email: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      createdAt: true,
      tasks: {
        select: {
          id: true,
          completed: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    emailVerified: u.emailVerified,
    image: u.image,
    role: u.role,
    createdAt: u.createdAt,
    totalTasks: u.tasks.length,
    completedTasks: u.tasks.filter((t) => t.completed).length,
  }));
}

/**
 * Update user role (Promote to ADMIN or Demote to USER).
 */
export async function updateUserRole(
  userId: string,
  newRole: "USER" | "ADMIN"
) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return updated;
}
