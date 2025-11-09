/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  // Use standalone output to avoid build trace issues
  output: 'standalone',
}

module.exports = nextConfig
