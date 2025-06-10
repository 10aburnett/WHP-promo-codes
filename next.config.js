/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['cdn.prod.website-files.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: false,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    largePageDataBytes: 5 * 1024 * 1024, // 5MB
  },
  typescript: {
    // !! WARN !!
    // Temporarily ignore TypeScript errors
    // Remove this when Prisma Client is properly regenerated
    ignoreBuildErrors: true,
  },
  // Disable React strict mode to avoid double renders in development
  // This helps react-beautiful-dnd work properly in development
  reactStrictMode: false,
};

module.exports = nextConfig;
