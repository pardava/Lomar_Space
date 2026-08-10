import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Only needed while seed.sql still uses placehold.co placeholder
      // images — remove once you swap those for real product photos.
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
