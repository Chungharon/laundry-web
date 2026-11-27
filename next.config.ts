import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: plain HTML/CSS/JS for Firebase Hosting (design system flow.md).
  // No API routes: bookings post to a Cloud Function (see src/lib/booking.ts).
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
