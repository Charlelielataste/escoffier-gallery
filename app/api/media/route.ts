import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary resource type
interface CloudinaryResource {
  public_id: string;
  format: string;
  resource_type: string;
  secure_url: string;
  created_at: string;
}

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const assetFolder = process.env.CLOUDINARY_FOLDER || "escoffier-event";

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

    // Fetch images
    let images: CloudinaryResource[] = [];
    try {
      const imagesResponse = await cloudinary.api.resources_by_asset_folder(
        assetFolder,
        {
          resource_type: "image",
          max_results: 500,
        }
      );
      images = imagesResponse.resources || [];
    } catch (err) {
      console.log("No images found:", err);
    }

    // Fetch videos
    let videos: CloudinaryResource[] = [];
    try {
      const videosResponse = await cloudinary.api.resources_by_asset_folder(
        assetFolder,
        {
          resource_type: "video",
          max_results: 500,
        }
      );
      videos = videosResponse.resources || [];
    } catch (err) {
      console.log("No videos found:", err);
    }

    // Safety filter: ensure images don't have video format
    images = images.filter(
      (resource) => !videoFormats.includes(resource.format?.toLowerCase())
    );

    // Safety filter: ensure videos have video format
    videos = videos.filter(
      (resource) =>
        videoFormats.includes(resource.format?.toLowerCase()) ||
        resource.resource_type === "video"
    );

    console.log(
      `Media retrieved - Images: ${images.length}, Videos: ${videos.length}`
    );

    return NextResponse.json({
      images,
      videos,
    });
  } catch (error) {
    console.error("Media fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}
