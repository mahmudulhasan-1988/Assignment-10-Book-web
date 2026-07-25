/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@better-auth/kysely-adapter', 'kysely'],
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "**" },
      { protocol: "https", hostname: "**" },
    ],
  },
  async rewrites() {
    return [
      // Proxy API routes to Express backend (except auth routes which stay in Next.js)
      { source: "/api/books/:path*", destination: "http://localhost:5000/api/books/:path*" },
      { source: "/api/books", destination: "http://localhost:5000/api/books" },
      { source: "/api/reviews/:path*", destination: "http://localhost:5000/api/reviews/:path*" },
      { source: "/api/reviews", destination: "http://localhost:5000/api/reviews" },
      { source: "/api/deliveries/:path*", destination: "http://localhost:5000/api/deliveries/:path*" },
      { source: "/api/deliveries", destination: "http://localhost:5000/api/deliveries" },
      { source: "/api/reading-list/:path*", destination: "http://localhost:5000/api/reading-list/:path*" },
      { source: "/api/reading-list", destination: "http://localhost:5000/api/reading-list" },
      { source: "/api/users/:path*", destination: "http://localhost:5000/api/users/:path*" },
      { source: "/api/users", destination: "http://localhost:5000/api/users" },
      { source: "/api/upload", destination: "http://localhost:5000/api/upload" },
      { source: "/api/health", destination: "http://localhost:5000/api/health" },
      { source: "/uploads/:path*", destination: "http://localhost:5000/uploads/:path*" },
    ];
  },
  reactCompiler: true,
};

export default nextConfig;
