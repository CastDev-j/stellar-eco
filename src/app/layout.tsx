import Header from "@/components/shared/header";
import "./globals.css";
import Footer from "@/components/shared/footer";
import AppProviders from "@/components/providers/app-providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
