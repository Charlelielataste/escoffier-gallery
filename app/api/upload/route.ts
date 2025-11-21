import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using Dynamic Folder Mode
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: type === "video" ? "video" : "image",
          // Dynamic folder mode: asset_folder for Media Library organization
          asset_folder: process.env.CLOUDINARY_FOLDER || "escoffier-event",
          // Use original filename as display_name
          use_filename_as_display_name: true,
          // Generate unique public_id automatically
          unique_filename: true,
          // Prefix public_id with folder name for clear structure
          use_asset_folder_as_public_id_prefix: true,
          // For videos, limit quality to save storage space
          ...(type === "video" && {
            transformation: [{ quality: "auto:low", fetch_format: "auto" }],
          }),
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
