/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@better-auth/kysely-adapter', 'kysely'],
   images: {
    remotePatterns: [
       {
        protocol: "http",
        hostname: "**",
      },
       {
        protocol: "https",
        hostname: "**",
      },
       
    ],
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
