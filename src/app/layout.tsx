import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrbitPrep AI",
  description: "AI-powered government exam preparation platform for UPSC, APSC, SSC, Railway, Banking and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050816] text-white antialiased">
        {children}
      </body>
    </html>
  );
}