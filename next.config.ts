import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Project page: served at /ananykotawala.github.io/ on akotawala10.github.io
  basePath: "/ananykotawala.github.io",
  assetPrefix: "/ananykotawala.github.io",
};

export default nextConfig;
