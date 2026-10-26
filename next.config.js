const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "maps.googleapis.com",
      "upload.wikimedia.org",
      "avatar.vercel.sh",
    ],
  },
};

module.exports = nextConfig;
