/**
 * Design Tokens
 * Option A (dark)  — Legal Navy: 딥 네이비 기반, 권위·신뢰
 * Option C (light) — Authority Slate: 화이트 베이스, 데이터 가독성 최우선
 */

import { theme as antTheme } from "antd";
import type { ThemeConfig } from "antd";

/** Option C — Authority Slate (Light) */
export const lightTheme: ThemeConfig = {
  algorithm: antTheme.defaultAlgorithm,
  token: {
    colorPrimary: "#0057B8",
    colorBgBase: "#FFFFFF",
    colorBgLayout: "#F4F6F9",
    colorBorder: "#DDE3EB",
    colorText: "#1A1F2E",
    colorTextSecondary: "#4A5568",
    borderRadius: 6,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Menu: {
      itemSelectedBg: "#E8F0FA",
      itemSelectedColor: "#0057B8",
      itemHoverBg: "#F0F4F9",
      itemColor: "#4A5568",
    },
    Table: {
      headerBg: "#F4F6F9",
      rowHoverBg: "#EEF3FB",
    },
    Card: {
      boxShadowTertiary: "0 1px 4px rgba(0,0,0,0.06)",
    },
  },
};

/** Option A — Legal Navy (Dark) */
export const darkTheme: ThemeConfig = {
  algorithm: antTheme.darkAlgorithm,
  token: {
    colorPrimary: "#4D9FFF",
    colorBgBase: "#0A1628",
    colorBgContainer: "#0E2040",
    colorBgElevated: "#1A2F4A",
    colorBgLayout: "#070F1C",
    colorBorder: "#1E3A5F",
    colorBorderSecondary: "#162D4A",
    colorText: "#D8E4F0",
    colorTextSecondary: "#8FA6C0",
    colorTextTertiary: "#5B7A9E",
    colorTextQuaternary: "#3A5A7E",
    colorFillSecondary: "#162D4A",
    colorFillTertiary: "#0D1E38",
    colorFillQuaternary: "#0A1628",
    colorBgSpotlight: "#1A2F4A",
    borderRadius: 6,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Menu: {
      darkItemBg: "#0C1B30",
      darkItemSelectedBg: "#0D2444",
      darkItemHoverBg: "#0F2238",
    },
    Table: {
      headerBg: "#0D1E38",
      rowHoverBg: "#0F2238",
      colorBgContainer: "#0E2040",
      borderColor: "#1E3A5F",
    },
    Card: {
      colorBgContainer: "#0E2040",
      colorBorderSecondary: "#1E3A5F",
    },
    Modal: {
      contentBg: "#0E2040",
      headerBg: "#0E2040",
    },
    Drawer: {
      colorBgElevated: "#0E2040",
    },
    Descriptions: {
      colorBgContainer: "#0E2040",
      labelBg: "#0D1E38",
    },
    Statistic: {
      colorTextDescription: "#8FA6C0",
    },
    Tabs: {
      colorBgContainer: "#0E2040",
      itemSelectedColor: "#4D9FFF",
      itemColor: "#8FA6C0",
      itemHoverColor: "#B0C8E8",
    },
    Tag: {
      colorBgContainer: "#162D4A",
    },
    Input: {
      colorBgContainer: "#0A1628",
      colorBorder: "#1E3A5F",
    },
    Select: {
      colorBgContainer: "#0A1628",
      colorBorder: "#1E3A5F",
      optionSelectedBg: "#0D2444",
    },
    Segmented: {
      itemSelectedBg: "#0D2444",
      trackBg: "#0D1E38",
    },
    Alert: {
      colorInfoBg: "#0D2444",
      colorInfoBorder: "#1E3A5F",
      colorWarningBg: "#2A1E00",
      colorWarningBorder: "#5B4000",
      colorSuccessBg: "#0A2E1A",
      colorSuccessBorder: "#1A5C34",
      colorErrorBg: "#2E0A0A",
      colorErrorBorder: "#5C1A1A",
    },
    Result: {
      colorBgContainer: "#0E2040",
    },
    Breadcrumb: {
      separatorColor: "#3A5A7E",
    },
  },
};
