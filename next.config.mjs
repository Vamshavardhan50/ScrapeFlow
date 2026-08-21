/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for production
  reactStrictMode: true,

  // Increase payload size for large HTML content
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },

  // Webpack configuration for Puppeteer (external for Vercel serverless)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude Puppeteer from bundle - use remote browser service on Vercel
      config.externals = [...(config.externals || []), "puppeteer"];
    }
    return config;
  },
};

export default nextConfig;
