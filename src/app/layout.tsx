// import "bootstrap/scss/bootstrap.scss";
import "./globals.scss";

import { Inter } from "next/font/google";
import { BootstrapClient } from "@/components/BootstrapClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "You: Quantified",
  description: "Creative multimodal data representation of the quantified self",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
