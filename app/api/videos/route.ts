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
  thumbnail_url?: string;
}

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getCachedVideos(cursor?: string) {
  return unstable_cache(
    async () => {
      const assetFolder =
        process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "escoffier-event";
      const maxResults = 4;

      const searchExpression = `asset_folder:${assetFolder} AND resource_type:video`;

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

      const filteredResources = allResources.filter((resource) => {
        return (
          resource.resource_type === "video" &&
          resource.public_id?.startsWith(`${assetFolder}/`)
        );
      });

      const videos = filteredResources.map((resource) => {
        const thumbnailUrl = cloudinary.url(resource.public_id, {
          resource_type: "video",
          format: "jpg",
          width: 400,
          height: 400,
          crop: "fill",
          quality: "auto",
          gravity: "auto",
        });

        const optimizedVideoUrl = cloudinary.url(resource.public_id, {
          resource_type: "video",
          quality: "auto:low",
          fetch_format: "auto",
          width: 720,
        });

        return {
          ...resource,
          secure_url: optimizedVideoUrl,
          thumbnail_url: thumbnailUrl,
        };
      });

      return {
        videos,
        nextCursor: nextCursor || null,
        hasMore: !!nextCursor,
        totalCount,
      };
    },
    ["cloudinary-videos", cursor ?? "initial"],
    { revalidate: 60, tags: ["cloudinary-videos"] }
  )();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor") || undefined;

    const data = await getCachedVideos(cursor);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Videos fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
