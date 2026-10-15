/**
 * POST /api/upload/image
 *
 * Server-side Cloudinary upload handler using the official Cloudinary SDK.
 *
 * Why server-side?
 * Cloudinary requires an API Secret to sign upload requests.
 * Exposing the secret in client-side code is a serious security risk.
 * Instead, the client sends the image file here; this route uses the official
 * Cloudinary Node.js SDK to securely stream the upload to Cloudinary without
 * manual signature generation.
 *
 * Required environment variables:
 *   CLOUDINARY_CLOUD_NAME   — your Cloudinary cloud name
 *   CLOUDINARY_API_KEY      — your Cloudinary API key
 *   CLOUDINARY_API_SECRET   — your Cloudinary API secret (server-side only)
 */

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // ── Validate file type ────────────────────────────────────────────────
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
        },
        { status: 400 }
      );
    }

    // ── Validate file size (max 5 MB) ─────────────────────────────────────
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File is too large. Maximum size is 5 MB.",
        },
        { status: 400 }
      );
    }

    // ── Check Cloudinary credentials ──────────────────────────────────────
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary credentials are not configured.");
      return NextResponse.json(
        { success: false, error: "Image upload service is not configured." },
        { status: 503 }
      );
    }

    // Ensure config is in sync with latest environment variables
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    // ── Read file buffer ──────────────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── Upload to Cloudinary using official SDK upload_stream ─────────────
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ownspace/profiles",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload returned empty response"));
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image to Cloudinary." },
      { status: 500 }
    );
  }
}
