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
  full_url?: string; // High quality for modal
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
    const maxResults = 8; // 8 images per page (optimisé pour réduire les transformations)

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
    // Use resources API with prefix filter (more reliable than resources_by_asset_folder)
    let images: CloudinaryResource[] = [];
    let nextCursor: string | undefined = undefined;

    try {
      // Use Search API which properly supports sorting and pagination
      // This ensures consistent ordering across pages
      const searchExpression = `asset_folder:${assetFolder} AND resource_type:image`;

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

      // Safety filter: ensure images don't have video format
      // Search API should already filter by resource_type, but double-check
      const filteredResources = allResources.filter(
        (resource) =>
          resource.resource_type === "image" &&
          !videoFormats.includes(resource.format?.toLowerCase()) &&
          resource.public_id?.startsWith(`${assetFolder}/`)
      );

      // Generate optimized URLs for thumbnails (grid view) and full size (modal)
      images = filteredResources.map((resource) => {
        // Generate optimized URL for grid (400x400, auto quality, auto format)
        const optimizedUrl = cloudinary.url(resource.public_id, {
          resource_type: "image",
          width: 400,
          height: 400,
          crop: "fill",
          quality: "auto",
          fetch_format: "auto", // WebP if supported
          gravity: "auto", // Smart cropping
        });

        // Generate high quality URL for modal (max 1080px width, auto quality)
        // Keep original aspect ratio, just limit max width (optimisé pour réduire bandwidth)
        // const fullUrl = cloudinary.url(resource.public_id, {
        //   resource_type: "image",
        //   width: 1080,
        //   quality: "auto",
        //   fetch_format: "auto",
        // });

        return {
          ...resource,
          secure_url: optimizedUrl, // Optimized for grid
        };
      });
    } catch (err) {
      console.error("Error fetching images:", err);
    }

    return NextResponse.json(
      {
        images,
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
    console.error("Images fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
