"use client";

import { useRouter, usePathname } from "next/navigation";
import { Breadcrumb, Tooltip, theme } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";

const pathLabels: Record<string, string> = {
  "/": "대시보드",
  "/applications": "신청 관리",
  "/cases": "심사 관리",
  "/cases/new": "신규 신청",
  "/contracts": "계약 관리",
  "/lifecycle": "사건 관리",
};

function buildBreadcrumbs(pathname: string) {
  const items: { title: React.ReactNode; href?: string }[] = [
    { title: <HomeOutlined />, href: "/" },
  ];

  const segments = pathname.split("/").filter(Boolean);
  let accumulated = "";
  for (const seg of segments) {
    accumulated += `/${seg}`;
    const label = pathLabels[accumulated];
    if (label) {
      items.push({ title: label, href: accumulated });
    } else if (segments.length > 1) {
      items.push({ title: seg.length > 10 ? `${seg.slice(0, 8)}...` : seg });
    }
  }
  return items;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { displayName, username, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();
  const { token } = theme.useToken();

  const breadcrumbItems = buildBreadcrumbs(pathname);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header
      style={{
        height: 48,
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Breadcrumb items={breadcrumbItems} style={{ fontSize: 13 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Tooltip title={mode === "dark" ? "라이트 모드" : "다크 모드"}>
          <span
            onClick={toggleTheme}
            style={{
              cursor: "pointer",
              color: token.colorTextSecondary,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
            }}
          >
            {mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
          </span>
        </Tooltip>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <UserOutlined style={{ color: token.colorTextSecondary, fontSize: 13 }} />
          <span style={{ fontSize: 13, color: token.colorText, fontWeight: 500 }}>
            {displayName}
          </span>
          <span style={{ fontSize: 11, color: token.colorTextTertiary }}>
            ({username})
          </span>
        </div>

        <Tooltip title="로그아웃">
          <LogoutOutlined
            onClick={handleLogout}
            style={{ color: token.colorTextSecondary, cursor: "pointer", fontSize: 14 }}
          />
        </Tooltip>
      </div>
    </header>
  );
}
