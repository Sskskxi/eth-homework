import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Scope Turbopack's file watcher to this directory only,
  // preventing it from scanning the parent eth-homework repo.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Prevent output file tracing from crawling parent directories.
  outputFileTracingRoot: path.resolve(__dirname),
  // Exclude heavy directories from file tracing entirely.
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@swc/**",
      "node_modules/@esbuild/**",
      "node_modules/webpack/**",
    ],
  },
};

export default nextConfig;
