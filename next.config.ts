import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // Allow the proxied Arena preview origin during development.
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
