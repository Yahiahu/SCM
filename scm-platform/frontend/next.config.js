/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const isProd = process.env.NODE_ENV === "production";

    return [
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*", // NextAuth
      },
      {
        source: "/api/:path*",
        destination: isProd
          ? "https://scm-api.onrender.com/api/:path*" // ⬅️ your Render backend
          : "http://localhost:5001/api/:path*", // ⬅️ local dev
      },
    ];
  },
};

module.exports = nextConfig;
