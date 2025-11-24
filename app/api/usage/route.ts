import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    // Récupérer les stats d'usage
    const usage = await cloudinary.api.usage();

    // Calculer les pourcentages
    const transformationsUsed = usage.transformations?.used || 0;
    const transformationsLimit = usage.transformations?.limit || 25000;
    const transformationsPercent =
      (transformationsUsed / transformationsLimit) * 100;

    const bandwidthUsed = usage.bandwidth?.used || 0;
    const bandwidthLimit = usage.bandwidth?.limit || 25000000000; // 25 GB en bytes
    const bandwidthPercent = (bandwidthUsed / bandwidthLimit) * 100;

    const storageUsed = usage.storage?.used || 0;
    const storageLimit = usage.storage?.limit || 26843545600; // 25 GB en bytes
    const storagePercent = (storageUsed / storageLimit) * 100;

    return NextResponse.json(
      {
        transformations: {
          used: transformationsUsed,
          limit: transformationsLimit,
          percent: Math.round(transformationsPercent * 100) / 100,
          remaining: transformationsLimit - transformationsUsed,
        },
        bandwidth: {
          used: bandwidthUsed,
          usedGB: (bandwidthUsed / 1024 / 1024 / 1024).toFixed(2),
          limit: bandwidthLimit,
          limitGB: (bandwidthLimit / 1024 / 1024 / 1024).toFixed(2),
          percent: Math.round(bandwidthPercent * 100) / 100,
          remainingGB: (
            (bandwidthLimit - bandwidthUsed) /
            1024 /
            1024 /
            1024
          ).toFixed(2),
        },
        storage: {
          used: storageUsed,
          usedGB: (storageUsed / 1024 / 1024 / 1024).toFixed(2),
          limit: storageLimit,
          limitGB: (storageLimit / 1024 / 1024 / 1024).toFixed(2),
          percent: Math.round(storagePercent * 100) / 100,
          remainingGB: (
            (storageLimit - storageUsed) /
            1024 /
            1024 /
            1024
          ).toFixed(2),
        },
        resetDate: usage.plan?.reset_at || null,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Usage fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    );
  }
}

