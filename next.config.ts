import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ['mongodb', '@aws-sdk/client-s3', 'sharp'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-e908bcd9e763481eb2c8ac2e24869f18.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:lang/solutions/ux-product-design',
        destination: '/:lang/solutions/ux-and-product-design',
        permanent: true,
      },
      {
        source: '/solutions/ux-product-design',
        destination: '/en/solutions/ux-and-product-design',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
