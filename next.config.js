/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  // Disable experimental features to avoid build issues
  experimental: {},
  // Help with build trace collection
  outputFileTracingRoot: __dirname,
}

module.exports = nextConfig
