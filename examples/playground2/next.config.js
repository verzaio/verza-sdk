/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },

  reactStrictMode: true,

  webpack(config) {
    return config;
  },
};

module.exports = nextConfig;
