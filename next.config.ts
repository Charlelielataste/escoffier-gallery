import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Domaines autorisés pour les images Cloudinary
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Désactiver l'optimisation d'images Next.js pour économiser sur Vercel
    unoptimized: false, // On garde l'optimisation pour le logo local uniquement
  },
  // Configuration pour les uploads
  experimental: {
    // Augmente la limite de body size (max sur Vercel gratuit : ~4.5 MB)
  },
};

export default nextConfig;
