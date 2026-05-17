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
    "Professional portfolio of MD MUBAROK HOSIN - A passionate Web Developer from Bangladesh specializing in modern web technologies like React, Next.js, TypeScript, and Node.js.",
  keywords: [
    "MD MUBAROK HOSIN",
    "Web Developer",
    "Bangladesh",
    "Portfolio",
    "Frontend Developer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "UI/UX Design",
    "Tailwind CSS",
    "Freelance Developer",
    "Dhaka",
    "Software Engineer",
    "Web Development",
  ],
  authors: [{ name: "MD MUBAROK HOSIN" }],
  icons: {
    icon: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/code-slash.svg",
  },
  openGraph: {
    title: "MD MUBAROK HOSIN | Web Developer",
    description: "Professional portfolio of MD MUBAROK HOSIN - Web Developer from Bangladesh specializing in React, Next.js & modern web technologies.",
    type: "website",
    url: "https://mdmubarokhosin.pages.dev",
    siteName: "MD MUBAROK HOSIN Portfolio",
    locale: "bn_BD",
    images: ['/og-image.svg'],
  },
  twitter: {
    card: "summary_large_image",
    title: "MD MUBAROK HOSIN | Web Developer",
    description: "Professional portfolio of MD MUBAROK HOSIN - Web Developer from Bangladesh",
    images: ['/og-image.svg'],
  },
  metadataBase: new URL("https://mdmubarokhosin.pages.dev"),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "MD MUBAROK HOSIN",
              "url": "https://mdmubarokhosin.pages.dev",
              "image": "https://mdmubarokhosin.pages.dev/profile.jpg",
              "jobTitle": "Web Developer",
              "description": "A passionate and experienced Web Developer from Bangladesh, specializing in React, Next.js, TypeScript, and Node.js.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Dhaka",
                "addressCountry": "BD"
              },
              "email": "mailto:contact.mdmubarok@gmail.com",
              "sameAs": [
                "https://github.com/mdmubarokhosin",
                "https://linkedin.com/in/mdmubarokhosin",
                "https://facebook.com/mdmubarokhosin",
                "https://twitter.com/mdmubarokhosin"
              ],
              "knowsAbout": [
                "React", "Next.js", "TypeScript", "JavaScript", "Node.js",
                "Tailwind CSS", "MongoDB", "REST API", "GraphQL", "UI/UX Design"
              ]
            })
          }}
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
