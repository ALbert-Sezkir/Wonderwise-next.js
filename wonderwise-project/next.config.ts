// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
//   },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:{
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorera TypeScript-fel under bygget
  },
 
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
