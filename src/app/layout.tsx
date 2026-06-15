import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import TopBanner from "@/components/TopBanner";

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "Shorten your URLs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Theme accentColor="indigo" radius="medium">
          <TopBanner />
          {children}
        </Theme>
      </body>
    </html>
  );
}
