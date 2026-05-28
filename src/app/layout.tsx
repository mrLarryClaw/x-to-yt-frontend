import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "X to YouTube",
  description: "Save X videos to your private YouTube",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1A1A2E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full bg-[#1A1A2E] text-white antialiased">
        <div className="mx-auto min-h-full w-full max-w-md px-4 py-6">
          {children}
          <ServiceWorkerRegistration />
        </div>
      </body>
    </html>
  );
}
