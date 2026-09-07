import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digitale Gewinner — Website Discovery",
  description:
    "Ein geführtes 3-Minuten-Briefing für Ihre neue Website, Funnels, Recruiting und digitale Prozesse.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
