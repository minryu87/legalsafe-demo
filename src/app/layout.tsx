import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AntdProvider from "@/components/layout/AntdProvider";

export const metadata: Metadata = {
  title: "LegalSafe ERP Demo",
  description: "소송금융 의사결정 ERP 데모",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AntdProvider>
          <Sidebar />
          <div style={{ marginLeft: 220, minHeight: "100vh" }}>
            <Header />
            <main style={{ padding: 24 }}>{children}</main>
          </div>
        </AntdProvider>
      </body>
    </html>
  );
}
