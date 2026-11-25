import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const heading = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-heading", weight: ["500", "600", "700", "800"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "RakitWeb — belajar membuat website",
  description: "Kursus membuat website untuk siswa kelas 1–6 SD.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${heading.variable} ${dmSans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
