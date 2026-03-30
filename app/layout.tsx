import "./globals.css";
import type { Metadata } from "next";
import { validateCriticalEnvOnStartup } from '@/lib/env';

export const metadata: Metadata = {
  title: "Fregenet Foundation | Empowering Ethiopian Leaders",
  description: "Building a sustainable future through education, nutrition, and technological empowerment for the children of Ethiopia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  validateCriticalEnvOnStartup();

  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface font-body text-on-surface antialiased bg-[#f9f9f9]">
        {children}
      </body>
    </html>
  );
}
