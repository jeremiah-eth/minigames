/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Temporarily ignore specific rules during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during builds (be careful with this)
    ignoreBuildErrors: false, // Keep this false to catch real issues
  },
  // Silence warnings
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
