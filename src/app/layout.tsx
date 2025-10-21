import Header from "@/components/shared/header";
import "./globals.css";
import Footer from "@/components/shared/footer";
import AppProviders from "@/components/providers/app-providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://ecos-estelares.vercel.app"
      : "http://localhost:3000"
  ),

  title: {
    default: "Ecos Estelares",
    template: "%s | Ecos Estelares",
  },
  description:
    "Ecos Estelares — Explora el universo con imágenes, videos y datos de la NASA.",
  keywords: [
    "NASA",
    "espacio",
    "astronomía",
    "imágenes",
    "universo",
    "favoritos",
  ],
  authors: [
    { name: "Andrés Castillo Jiménez" },
    { name: "Sugey Gutiérrez Calero" },
    { name: "Angel González Mejia" },
    { name: "Gibran Aron Herrera Herrera" },
  ],
  creator: "CastDev-j",

  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://ecos-estelares.vercel.app/",
    siteName: "Ecos Estelares",
    title: "Ecos Estelares — Explora el universo",
    description:
      "Ecos Estelares — Explora el universo con imágenes, videos y datos de la NASA.",
    images: [
      {
        url: "/og-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Ecos Estelares — vista previa",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ecos Estelares",
    description: "Ecos Estelares — Explora el universo con la NASA",
    creator: "@CastDevJ",
    images: ["/og-1200x630.png"],
  },

  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex flex-col justify-between min-h-screen">
        <AppProviders>
          <Header />
          <div className="sm:p-4 p-2">{children}</div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
