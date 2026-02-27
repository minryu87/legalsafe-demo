"use client";

import { Badge, Dropdown, List, Typography } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export default function Header() {
  const { notifications, unreadCount, markAsRead } = useNotificationStore();
  const router = useRouter();

  const handleClick = (caseId: string, notifId: number) => {
    markAsRead(notifId);
    router.push(`/fda/${caseId}`);
  };

  const dropdownContent = (
    <div style={{ width: 380, maxHeight: 400, overflow: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0", fontWeight: 600 }}>
        알림 ({unreadCount()}건 미확인)
      </div>
      <List
        dataSource={notifications.slice(0, 10)}
        renderItem={(item) => (
          <List.Item
            onClick={() => handleClick(item.caseId, item.id)}
            style={{
              padding: "10px 16px",
              cursor: "pointer",
              background: item.read ? "#fff" : "#f6ffed",
            }}
          >
            <List.Item.Meta
              title={<Text style={{ fontSize: 13 }}>{item.message}</Text>}
              description={
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {item.caseId} · {new Date(item.timestamp).toLocaleString("ko-KR")}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <header
      style={{
        height: 56,
        background: "#fff",
        borderBottom: "1px solid #e8e8e8",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Dropdown
        dropdownRender={() => dropdownContent}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Badge count={unreadCount()} size="small" offset={[-2, 2]}>
          <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
        </Badge>
      </Dropdown>
    </header>
  );
}
