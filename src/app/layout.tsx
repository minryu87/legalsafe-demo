import type { Metadata } from "next";
import "./globals.css";
import AntdProvider from "@/components/layout/AntdProvider";

export const metadata: Metadata = {
  title: "LEGALSAFE — 소송금융 투자심사 플랫폼",
  description: "ALEAN의 소송금융 투자심사 AI 플랫폼 LEGALSAFE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}
