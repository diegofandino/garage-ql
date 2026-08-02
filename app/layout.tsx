import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
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
      <body className="min-h-full flex flex-col container mx-auto text-white-800">
        <Toaster>{children}</Toaster>
      </body>
    </html>
  );
}
