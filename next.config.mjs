/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/adapter-pg', 'pg'],
  compiler: {
    styledComponents: true,
  },
  turbopack: {},
  eslint: {
    ignoreDuringBuilds: process.env.VERCEL === '1',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig