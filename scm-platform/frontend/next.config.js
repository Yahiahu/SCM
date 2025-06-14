/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // ✅ Allow NextAuth to handle its own API routes
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
      // ✅ Proxy all other /api requests to your backend
      {
        source: "/api/:path*",
        destination: "http://localhost:5001/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
