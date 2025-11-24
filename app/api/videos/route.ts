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
  thumbnail_url?: string; // For videos
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
    const maxResults = 4; // 4 videos per page (optimisé pour réduire les transformations)

    // Fetch videos with pagination
    // Use resources API with prefix filter (more reliable than resources_by_asset_folder)
    let videos: CloudinaryResource[] = [];
    let nextCursor: string | undefined = undefined;

    try {
      // Use Search API which properly supports sorting and pagination
      // This ensures consistent ordering across pages
      const searchExpression = `asset_folder:${assetFolder} AND resource_type:video`;

      // Build search query with proper sorting
      let searchQuery = cloudinary.search
        .expression(searchExpression)
        .sort_by("created_at", "desc")
        .max_results(maxResults);

      // Add cursor if provided for pagination
      if (cursor) {
        searchQuery = searchQuery.next_cursor(cursor);
      }

      const searchResponse = await searchQuery.execute();

      const allResources = (searchResponse.resources ||
        []) as CloudinaryResource[];
      nextCursor = searchResponse.next_cursor;

      // Filter to ensure only videos from the correct folder
      // Search API should already filter by resource_type, but double-check
      const filteredResources = allResources.filter((resource) => {
        return (
          resource.resource_type === "video" &&
          resource.public_id?.startsWith(`${assetFolder}/`)
        );
      });

      // Generate optimized URLs and thumbnails for videos
      videos = filteredResources.map((resource) => {
        // Generate thumbnail for grid view (400x400, JPG)
        const thumbnailUrl = cloudinary.url(resource.public_id, {
          resource_type: "video",
          format: "jpg",
          width: 400,
          height: 400,
          crop: "fill",
          quality: "auto",
          gravity: "auto",
        });

        // Generate optimized video URL (lower quality for faster loading)
        const optimizedVideoUrl = cloudinary.url(resource.public_id, {
          resource_type: "video",
          quality: "auto:low",
          fetch_format: "auto",
          width: 720, // Limit resolution to 720p (optimisé pour réduire bandwidth)
        });

        return {
          ...resource,
          secure_url: optimizedVideoUrl, // Optimized video URL
          thumbnail_url: thumbnailUrl, // Thumbnail for grid
        };
      });
    } catch (err) {
      console.error("Error fetching videos:", err);
    }

    return NextResponse.json(
      {
        videos,
        nextCursor: nextCursor || null,
        hasMore: !!nextCursor,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Videos fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
