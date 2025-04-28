import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  turbopack: {},
  eslint: {
    ignoreDuringBuilds: process.env.VERCEL === '1',
  },
}

export default nextConfig
