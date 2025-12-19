import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "sonner"; // <--- Added for notifications
import { ModalProvider } from "@/components/providers/modal-provider"; // <--- Added for Card Modal

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreeDeck",
  description: "Open source project management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 1. Global Providers */}
          <Toaster />
          <ModalProvider />

          {/* 2. Main App Layout */}
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            {/* md:pl-64 pushes content to the right on desktop to make room for sidebar */}
            <main className="flex-1 md:pl-64 transition-all duration-300">
              <div className="h-full p-8 bg-background">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}