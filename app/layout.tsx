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
  description: "Application for manage your dummie garage wiht grahpql",
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
