import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/ReduxProvider";
import { Toaster } from "sonner";

const baiJamjuree = Bai_Jamjuree({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans", // Setting it as the main sans font
});

export const metadata: Metadata = {
  title: "PH-Campus Hero",
  description: "Ambassador Tracking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${baiJamjuree.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
