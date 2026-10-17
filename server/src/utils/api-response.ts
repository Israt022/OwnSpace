import { NextResponse } from "next/server";
import { ApiResponse } from "../types";

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(
  message = "Internal Server Error",
  status = 500,
  error?: string
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(error ? { error } : {}),
    },
    { status }
  );
}
