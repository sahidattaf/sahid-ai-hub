import type { NextConfig } from "next";

const privateHeaders = [
  { key: "Cache-Control", value: "private, no-store, max-age=0" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

const nextConfig: NextConfig = {
  async redirects() {
    // Pre-dashboard routes now live behind authentication under /dashboard.
    return [
      { source: "/registry", destination: "/dashboard/projects", permanent: false },
      { source: "/github", destination: "/dashboard/github", permanent: false },
      { source: "/vercel", destination: "/dashboard/vercel", permanent: false },
      { source: "/revenue", destination: "/dashboard/revenue", permanent: false },
      { source: "/integrations", destination: "/dashboard/settings", permanent: false },
    ];
  },
  async headers() {
    return [
      { source: "/dashboard/:path*", headers: privateHeaders },
      { source: "/api/private/:path*", headers: privateHeaders },
      { source: "/login", headers: privateHeaders },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
