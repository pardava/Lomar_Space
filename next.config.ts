import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Only needed while seed.sql still uses placehold.co placeholder
      // images — remove once you swap those for real product photos.
      { protocol: "https", hostname: "placehold.co" },
      // Replicate serves AI-generated images from this domain and its subdomains
      { protocol: "https", hostname: "replicate.delivery" },
      { protocol: "https", hostname: "*.replicate.delivery" },
    ],
  },
};

export default nextConfig;