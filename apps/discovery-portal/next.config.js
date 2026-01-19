import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
    './i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'vertebrados.iiap.gob.pe',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'www.iperu.org',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'portal.andina.pe',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'bioweb.bio',
                pathname: '**',
            }

        ],
    },
}

export default withNextIntl(nextConfig);
