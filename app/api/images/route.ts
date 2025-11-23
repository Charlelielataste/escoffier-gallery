import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary resource type
interface CloudinaryResource {
  public_id: string;
  format: string;
  resource_type: string;
  secure_url: string;
  created_at: string;
  width?: number;
  height?: number;
}

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    const assetFolder =
      process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "escoffier-event";

    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor") || undefined;
    const maxResults = 10; // 10 images per page

    // Common video formats to filter out
    const videoFormats = [
      "mp4",
      "mov",
      "avi",
      "webm",
      "mkv",
      "flv",
      "wmv",
      "m4v",
    ];

    // Fetch images with pagination
    let images: CloudinaryResource[] = [];
    let nextCursor: string | undefined = undefined;

    try {
      const imagesResponse = await cloudinary.api.resources_by_asset_folder(
        assetFolder,
        {
          resource_type: "image",
          max_results: maxResults,
          next_cursor: cursor,
        }
      );

      const allResources = imagesResponse.resources || [];
      nextCursor = imagesResponse.next_cursor;

      // Safety filter: ensure images don't have video format and are actually images
      images = allResources.filter(
        (resource) =>
          resource.resource_type === "image" &&
          !videoFormats.includes(resource.format?.toLowerCase())
      );
    } catch (err) {
      console.error("Error fetching images:", err);
    }

    return NextResponse.json({
      images,
      nextCursor: nextCursor || null,
      hasMore: !!nextCursor,
    });
  } catch (error) {
    console.error("Images fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
