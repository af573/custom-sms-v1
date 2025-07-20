import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    // Skip eslint errors during `next build`
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip TS errors during `next build`
    ignoreBuildErrors: true,
  },
  images: {
    // Disable next/image optimization (useful on Vercel if you host images elsewhere)
    unoptimized: true,
  },
}

export default nextConfig
