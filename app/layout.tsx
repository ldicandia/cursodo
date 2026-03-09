import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cursodo - Dental Courses Marketplace",
  description: "Discover and schedule the best dental courses from specialized instructors.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <Navbar user={user} />
        <main className="flex-1 flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
