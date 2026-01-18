/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/shared-types', '@repo/ui', '@repo/networking'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'storage.amphibians.iiap.gob.pe',
        port: '81',
        pathname: '/individuals/images/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.amphibians.iiap.gob.pe',
        pathname: '/individuals/images/**',
      },
      {
        protocol: 'https',
        hostname: 'api-vertebrados.iiap.gob.pe',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'vertebrados.iiap.gob.pe',
      },
    ],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;
