import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
      {
        protocol: 'https', 
        hostname: 'fn7elswcm6icv7a5.public.blob.vercel-storage.com' 
      },
    ],
  },
};

export default nextConfig;
