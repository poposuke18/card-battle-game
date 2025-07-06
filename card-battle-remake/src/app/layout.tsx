import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/contexts/GameContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Card Battle Remake",
  description: "戦略的カードバトルゲーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}