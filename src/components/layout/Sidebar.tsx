"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Tooltip } from "antd";
import {
  DashboardOutlined,
  FormOutlined,
  AuditOutlined,
  FileProtectOutlined,
  ProjectOutlined,
  LogoutOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";

const menuItems = [
  { key: "/", icon: <DashboardOutlined />, label: "대시보드" },
  { key: "/applications", icon: <FormOutlined />, label: "신청 관리" },
  { key: "/cases", icon: <AuditOutlined />, label: "심사 관리" },
  { key: "/contracts", icon: <FileProtectOutlined />, label: "계약 관리" },
  { key: "/lifecycle", icon: <ProjectOutlined />, label: "사건 관리" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { displayName, username, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();

  const selectedKey =
    menuItems
      .filter((item) => item.key !== "/" && pathname.startsWith(item.key))
      .sort((a, b) => b.key.length - a.key.length)[0]?.key ?? "/";

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const isDark = mode === "dark";
  const sidebarBg = isDark ? "#0C1B30" : "#FFFFFF";
  const borderColor = isDark ? "rgba(255,255,255,0.07)" : "#E8ECF0";
  const textColor = isDark ? "rgba(255,255,255,0.85)" : "#1A1F2E";
  const textMuted = isDark ? "rgba(255,255,255,0.45)" : "#8C96A0";
  const creditColor = isDark ? "rgba(255,255,255,0.25)" : "#B0B8C4";

  return (
    <aside
      style={{
        width: 220,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background: sidebarBg,
        borderRight: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        transition: "background 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* 로고 영역 */}
      <div
        style={{
          padding: "20px 16px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Image
          src={isDark ? "/logo_transparent.png" : "/logo.avif"}
          alt="LEGALSAFE"
          width={280}
          height={56}
          style={{ objectFit: "contain", maxWidth: "100%" }}
          priority
        />
      </div>

      {/* 네비게이션 메뉴 */}
      <Menu
        theme={isDark ? "dark" : "light"}
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{
          flex: 1,
          borderRight: 0,
          background: "transparent",
          paddingTop: 8,
        }}
      />

      {/* 하단: 유저 + 테마 + 로그아웃 */}
      <div
        style={{
          padding: "10px 16px",
          borderTop: `1px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
          <UserOutlined style={{ color: textMuted, flexShrink: 0, fontSize: 13 }} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: textColor,
                fontSize: 12,
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </div>
            <div style={{ color: textMuted, fontSize: 10 }}>{username}</div>
          </div>
        </div>

        <Tooltip title={isDark ? "라이트 모드" : "다크 모드"}>
          <span
            onClick={toggleTheme}
            style={{ color: textMuted, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center" }}
          >
            {isDark ? <SunOutlined /> : <MoonOutlined />}
          </span>
        </Tooltip>

        <Tooltip title="로그아웃">
          <LogoutOutlined
            onClick={handleLogout}
            style={{ color: textMuted, cursor: "pointer", fontSize: 14 }}
          />
        </Tooltip>
      </div>

      {/* 크레딧 */}
      <div style={{ padding: "6px 16px 10px", textAlign: "center" }}>
        <div style={{ fontSize: 9, color: creditColor, letterSpacing: "0.05em" }}>
          LEGALSAFE by ALEAN
        </div>
      </div>
    </aside>
  );
}
