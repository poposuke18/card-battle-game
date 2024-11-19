// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',  // これを追加
  preload: true     // これを追加
});

export const metadata: Metadata = {
  title: "Card Battle Game",
  description: "戦略的なカードバトルゲーム。5x5のフィールドで繰り広げられる頭脳戦。",
  keywords: "カードゲーム, 戦略ゲーム, ブラウザゲーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}