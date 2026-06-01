import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Allow larger Server Action request bodies to support file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '16mb',
    },
  },
};

export default nextConfig;
