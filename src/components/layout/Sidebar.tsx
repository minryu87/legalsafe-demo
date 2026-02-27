"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu } from "antd";
import {
  DashboardOutlined,
  FileAddOutlined,
  AuditOutlined,
  FileProtectOutlined,
  DollarOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

const menuItems = [
  { key: "/", icon: <DashboardOutlined />, label: "대시보드" },
  { key: "/applications", icon: <FileAddOutlined />, label: "신청 관리" },
  { key: "/fda", icon: <AuditOutlined />, label: "FDA 심사" },
  { key: "/contracts", icon: <FileProtectOutlined />, label: "계약 관리" },
  { key: "/finance", icon: <DollarOutlined />, label: "재무 관리" },
  { key: "/cases", icon: <FolderOpenOutlined />, label: "사건 관리" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const selectedKey = menuItems.find(
    (item) => item.key !== "/" && pathname.startsWith(item.key)
  )?.key ?? "/";

  return (
    <aside
      style={{
        width: 220,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background: "#001529",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>
          LegalSafe ERP
        </span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ flex: 1, borderRight: 0 }}
      />
    </aside>
  );
}
