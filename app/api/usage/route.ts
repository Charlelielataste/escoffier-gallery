import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // Vérifier que les credentials sont présents
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary credentials not configured" },
        { status: 500 }
      );
    }

    // Récupérer les stats d'usage
    const usage = await cloudinary.api.usage();

    // Debug: log la réponse complète en développement
    if (process.env.NODE_ENV === "development") {
      console.log("Cloudinary usage response:", JSON.stringify(usage, null, 2));
    }

    // Vérifier que usage existe
    if (!usage) {
      return NextResponse.json(
        { error: "No usage data returned from Cloudinary" },
        { status: 500 }
      );
    }

    // Extraire les données de la réponse Cloudinary
    // Structure réelle : transformations.usage, bandwidth.usage, storage.usage
    const transformationsUsed = usage.transformations?.usage || 0;
    const transformationsCredits = usage.transformations?.credits_usage || 0;
    // Pour le plan gratuit, on utilise les crédits comme limite (25 crédits/mois)
    const creditsLimit = usage.credits?.limit || 25;
    const creditsUsed = usage.credits?.usage || 0;
    const creditsPercent = usage.credits?.used_percent || 0;

    const bandwidthUsed = usage.bandwidth?.usage || 0;
    const bandwidthLimit = 25 * 1024 * 1024 * 1024; // 25 GB en bytes (plan gratuit)
    const bandwidthPercent =
      bandwidthLimit > 0 ? (bandwidthUsed / bandwidthLimit) * 100 : 0;

    const storageUsed = usage.storage?.usage || 0;
    const storageLimit = 25 * 1024 * 1024 * 1024; // 25 GB en bytes (plan gratuit)
    const storagePercent =
      storageLimit > 0 ? (storageUsed / storageLimit) * 100 : 0;

    return NextResponse.json(
      {
        credits: {
          used: creditsUsed,
          limit: creditsLimit,
          percent: Math.round(creditsPercent * 100) / 100,
          remaining: creditsLimit - creditsUsed,
        },
        transformations: {
          used: transformationsUsed,
          creditsUsed: transformationsCredits,
          // Pas de limite directe, on utilise les crédits
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
        resetDate: usage.rate_limit_reset_at || null,
        resources: usage.resources || 0,
        impressions: usage.impressions?.usage || 0,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Usage fetch error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;
    return NextResponse.json(
      {
        error: "Failed to fetch usage",
        message: errorMessage,
        details: errorStack,
      },
      { status: 500 }
    );
  }
}
