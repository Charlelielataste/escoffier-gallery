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
    const maxResults = 5; // 5 videos per page

    // Common video formats
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

    // Fetch videos with pagination
    let videos: CloudinaryResource[] = [];
    let nextCursor: string | undefined = undefined;

    try {
      const options: Record<string, unknown> = {
        resource_type: "video",
        max_results: maxResults,
      };

      // Add cursor only if provided
      if (cursor) {
        options.next_cursor = cursor;
      }

      const videosResponse = await cloudinary.api.resources_by_asset_folder(
        assetFolder,
        options
      );

      const allResources = videosResponse.resources || [];
      nextCursor = videosResponse.next_cursor;

      // Filter to keep only actual videos
      // Cloudinary sometimes returns images even when requesting video type
      videos = allResources.filter((resource) => {
        const isVideoResourceType = resource.resource_type === "video";
        const isVideoFormat =
          resource.format &&
          videoFormats.includes(resource.format.toLowerCase());

        return isVideoResourceType || isVideoFormat;
      });
    } catch (err) {
      console.error("Error fetching videos:", err);
    }

    return NextResponse.json({
      videos,
      nextCursor: nextCursor || null,
      hasMore: !!nextCursor,
    });
  } catch (error) {
    console.error("Videos fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
