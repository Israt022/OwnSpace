import { Request, Response } from "express";
import prisma from "../config/db";

export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};