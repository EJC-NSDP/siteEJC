import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  turbopack: {},
  eslint: {
    ignoreDuringBuilds: process.env.VERCEL === '1',
  },
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/**')],
  },
}

export default nextConfig
