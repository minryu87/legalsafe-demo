"use client";

import { useEffect } from "react";
import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";
import { useThemeStore } from "@/stores/useThemeStore";
import { lightTheme, darkTheme } from "@/lib/designTokens";

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();
  const themeConfig = mode === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <ConfigProvider locale={koKR} theme={themeConfig}>
      {children}
    </ConfigProvider>
  );
}
