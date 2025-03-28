import { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Skips ESLint during builds
  },
};

export default nextConfig;
