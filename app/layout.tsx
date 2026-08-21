import { AppProviders } from "@/components/providers/AppProviders";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ScrapeFlow — Visual Web Scraping & Automation Platform",
  description: "Create, automate, schedule, and execute AI-powered web scraping workflows visually.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={"/sign-in"}
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-primary hover:bg-primary/90 text-sm !shadow-none font-medium",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <body className={`${inter.className} antialiased min-h-screen selection:bg-primary selection:text-white`}>
          <AppProviders>{children}</AppProviders>
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
