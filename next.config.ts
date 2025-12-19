import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000", 
        "probable-space-broccoli-jvv564v9g9r3jgxp-3000.app.github.dev"
      ],
    },
  },
};

export default nextConfig;