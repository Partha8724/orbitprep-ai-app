import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: {
    default: "OrbitPrep AI - AI-Powered Government Exam Preparation",
    template: "%s | OrbitPrep AI",
  },
  description:
    "Prepare for UPSC, APSC, SSC, Railway, Banking and government exams with AI mentor, mock tests, PDFs, previous papers, and daily current affairs.",
  metadataBase: new URL("https://orbitprep-ai.vercel.app"),
  openGraph: {
    title: "OrbitPrep AI - Government Exam Prep",
    description: "AI-powered platform for Indian government exam preparation.",
    url: "https://orbitprep-ai.vercel.app",
    siteName: "OrbitPrep AI",
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-[#050816] text-white antialiased font-sans">{children}</body>
    </html>
  );
}



