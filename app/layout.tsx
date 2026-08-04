import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import "./globals.css";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "GarageQL",
  description: "GarageQL is a project building for manage your cars inside your garage.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "GarageQL",
    description: "Keep your vehicles and maintenance records in good shape.",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "GarageQL — vehicle maintenance tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GarageQL",
    description: "Keep your vehicles and maintenance records in good shape.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.className} h-full antialiased dark`}
    >
      <body className="flex min-h-full min-h-screen w-full text-stone-100">
        <div className="mx-auto flex flex-1 flex-col border-x border-white/15">
          <SiteHeader />
          <main className="flex-1">
            <Toaster>{children}</Toaster>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
