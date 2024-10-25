/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enables React's strict mode to identify potential problems

  images: {
    //  domains: ["example.com"], // Configures allowed external image sources
    formats: ["image/avif", "image/webp"], // Enables optimized image formats
  },
  // env: {
  //   CUSTOM_ENV_VARIABLE: "your_value", // Set custom environment variables (as strings only)
  // },
};

module.exports = nextConfig;
