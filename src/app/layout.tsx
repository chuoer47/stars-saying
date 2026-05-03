import type { Metadata } from "next";
import { HorizontalDragScroll } from "@/components/horizontal-drag-scroll";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stars-saying.vercel.app"),
  title: "假设星星会说话",
  description: "给孩子的星空聊天、图鉴、课堂和愿望卡小应用。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <HorizontalDragScroll />
      </body>
    </html>
  );
}
