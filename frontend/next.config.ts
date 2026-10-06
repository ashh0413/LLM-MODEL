import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during build for faster dev cycles
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
