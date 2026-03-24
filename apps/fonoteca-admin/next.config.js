/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/shared-types', '@repo/ui', '@repo/networking'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.amphibians.iiap.gob.pe',
      },
      {
        protocol: 'https',
        hostname: 'api-vertebrados.iiap.gob.pe',
      },
    ],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;
