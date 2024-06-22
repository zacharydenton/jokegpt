import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "jokegpt",
  description: "Generate jokes using GPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white dark:bg-slate-800">
      <body>{children}</body>
    </html>
  );
}
