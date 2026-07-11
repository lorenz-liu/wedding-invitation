import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["tablestore", "ali-oss", "@alicloud/credentials"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
