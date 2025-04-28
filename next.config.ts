import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  turbopack: {},
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
