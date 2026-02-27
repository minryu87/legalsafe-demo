"use client";

import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={koKR}
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
