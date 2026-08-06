/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Supprimé pour permettre à l'API du chat de fonctionner
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;