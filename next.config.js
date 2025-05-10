/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["images.unsplash.com"],
    unoptimized: true,
  },
  // Disable all webpack optimizations
  webpack: (config, { isServer }) => {
    // Disable all optimizations
    config.optimization.minimize = false

    // Return the modified config
    return config
  },
}

module.exports = nextConfig
