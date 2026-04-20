import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { unstable_cache } from "next/cache";

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
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

function getCachedImages(cursor?: string) {
  return unstable_cache(
    async () => {
      const assetFolder =
        process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "escoffier-event";
      const maxResults = 8;

      const searchExpression = `asset_folder:${assetFolder} AND resource_type:image`;

      let searchQuery = cloudinary.search
        .expression(searchExpression)
        .sort_by("created_at", "desc")
        .max_results(maxResults);

      if (cursor) {
        searchQuery = searchQuery.next_cursor(cursor);
      }

      const searchResponse = await searchQuery.execute();

      const allResources = (searchResponse.resources ||
        []) as CloudinaryResource[];
      const nextCursor = searchResponse.next_cursor;
      const totalCount = searchResponse.total_count ?? 0;

      const images = allResources.filter(
        (resource) =>
          resource.resource_type === "image" &&
          !videoFormats.includes(resource.format?.toLowerCase()) &&
          resource.public_id?.startsWith(`${assetFolder}/`)
      );

      return {
        images,
        nextCursor: nextCursor || null,
        hasMore: !!nextCursor,
        totalCount,
      };
    },
    ["cloudinary-images", cursor ?? "initial"],
    { revalidate: 60, tags: ["cloudinary-images"] }
  )();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor") || undefined;

    const data = await getCachedImages(cursor);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Images fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
