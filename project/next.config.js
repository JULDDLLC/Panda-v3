/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Skip lint errors during deploy
  },
  images: {
    unoptimized: true, // Needed for static export and Bolt
  },
  webpack: (config, { isServer }) => {
    // Fix for missing Node modules in browser builds
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // 🔧 Fix random cache errors (esp. in Bolt)
    if (process.env.NODE_ENV !== 'production') {
      config.cache = false;
    }

    return config;
  },
  // Enable static export when building for production
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
  }),
};

module.exports = nextConfig;
