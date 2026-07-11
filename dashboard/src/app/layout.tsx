import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedding Guest Dashboard",
  description: "婚礼宾客与涂鸦管理面板",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[#faf8f5] text-[#2c2c2c] antialiased">
        {children}
      </body>
    </html>
  );
}
