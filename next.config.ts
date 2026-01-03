import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["*.baiki.test", "baiki.test"],
};

export default nextConfig;
