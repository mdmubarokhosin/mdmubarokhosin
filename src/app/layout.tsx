import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { FirebaseProvider } from "@/context/FirebaseContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MD MUBAROK HOSIN | Web Developer - Portfolio",
  description:
    "Professional portfolio of MD MUBAROK HOSIN - A passionate Web Developer from Bangladesh specializing in modern web technologies.",
  keywords: [
    "MD MUBAROK HOSIN",
    "Web Developer",
    "Bangladesh",
    "Portfolio",
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "MD MUBAROK HOSIN" }],
  icons: {
    icon: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/code-slash.svg",
  },
  openGraph: {
    title: "MD MUBAROK HOSIN | Web Developer",
    description: "Professional portfolio of MD MUBAROK HOSIN - Web Developer from Bangladesh",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <FirebaseProvider>
              {children}
              <Toaster />
            </FirebaseProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
