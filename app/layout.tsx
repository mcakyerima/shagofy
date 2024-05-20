import {
  ClerkProvider,
} from '@clerk/nextjs';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from '@/provider/modal-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: " shagofy admin dashboard",
  description: "shagofy admin dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <ModalProvider/>
        <body className={inter.className}>
          {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
