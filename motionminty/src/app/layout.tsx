import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MotionMint-y – AI Content Factory", template: "%s | MotionMint-y" },
  description: "AI-powered content automation platform. Set it once. Let AI create and publish your content automatically.",
  keywords: ["AI content creation", "content automation", "video generation", "social media automation"],
  openGraph: {
    title: "MotionMint-y – AI Content Factory",
    description: "One topic → Complete content package → Automatic publishing",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
