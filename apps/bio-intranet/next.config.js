/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    transpilePackages: ["@repo/ui"],
};

module.exports = withNextIntl(nextConfig);
