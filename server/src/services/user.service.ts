import prisma from "../lib/prisma";
import { UserResponse } from "../types";

/**
 * Fetch all users from the database.
 */
export async function getAllUsers(): Promise<UserResponse[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}

/**
 * Fetch a single user by ID.
 */
export async function getUserById(id: string): Promise<UserResponse | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

/**
 * Fetch a single user by email.
 */
export async function getUserByEmail(email: string): Promise<UserResponse | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}
