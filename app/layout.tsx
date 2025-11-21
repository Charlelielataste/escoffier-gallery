import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const museoSans = localFont({
  src: [
    {
      path: "../public/fonts/Museo-Sans-100.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Museo-Sans-300.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Museo-Sans-500.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-museo-sans",
});

export const metadata: Metadata = {
  title: "Application Officielle des Disciples Escoffier Provence Mediterranee",
  description:
    "Application de partage de photos et vidéos officielle des Disciples Escoffier Provence Mediterranee",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className={`${museoSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
