import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Archivo, self-hosted (SIL OFL, see ./fonts/OFL.txt). The only family in the system.
const archivo = localFont({
  variable: "--font-archivo",
  display: "swap",
  src: [
    { path: "./fonts/archivo-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/archivo-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/archivo-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/archivo-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "./fonts/archivo-latin-900-normal.woff2", weight: "900", style: "normal" },
  ],
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Laundry Hub",
  description:
    "Laundry pickup and delivery in Nairobi. We weigh your laundry at your door and you pay with M-Pesa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-KE" className={`${archivo.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
