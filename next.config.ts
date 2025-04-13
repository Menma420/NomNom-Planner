import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        port: "",
        pathname: "/**",
        hostname: "img.clerk.com",
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
