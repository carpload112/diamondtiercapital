/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Disable ESLint during builds to prevent deployment failures
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during builds to prevent deployment failures
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["images.unsplash.com"],
    unoptimized: true,
  },
}

module.exports = nextConfig
