import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/adapter-pg', 'pg'],
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
