"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Form, Input, Button, Alert, Tooltip } from "antd";
import { LockOutlined, UserOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDark = mode === "dark";

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      await login(values.username, values.password);
      router.replace("/");
    } catch {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  const pageBg = isDark
    ? "linear-gradient(135deg, #070F1C 0%, #0A1628 60%, #0C2040 100%)"
    : "linear-gradient(135deg, #F4F6F9 0%, #E8EDF5 60%, #DCE4F0 100%)";

  const cardBg = isDark ? "#0E2040" : "#FFFFFF";
  const cardBorder = isDark ? "1px solid #1E3A5F" : "1px solid #DDE3EB";
  const labelColor = isDark ? "#8FA6C0" : "#4A5568";
  const companyColor = isDark ? "#8FA6C0" : "#6B7A99";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: pageBg,
        position: "relative",
      }}
    >
      {/* 테마 토글 — 우측 상단 */}
      <div style={{ position: "absolute", top: 20, right: 24 }}>
        <Tooltip title={isDark ? "라이트 모드" : "다크 모드"}>
          <span
            onClick={toggleTheme}
            style={{
              color: isDark ? "rgba(255,255,255,0.5)" : "#64748B",
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            {isDark ? <SunOutlined /> : <MoonOutlined />}
          </span>
        </Tooltip>
      </div>

      {/* 로그인 카드 */}
      <div
        style={{
          width: 400,
          background: cardBg,
          border: cardBorder,
          borderRadius: 12,
          padding: "40px 36px 32px",
          boxShadow: isDark
            ? "0 8px 40px rgba(0,0,0,0.5)"
            : "0 4px 32px rgba(0,40,100,0.08)",
          transition: "background 0.2s ease, border 0.2s ease",
        }}
      >
        {/* 로고 */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Image
              src={isDark ? "/logo_transparent.png" : "/logo.avif"}
              alt="LEGALSAFE"
              width={180}
              height={44}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div
            style={{
              fontSize: 13,
              color: companyColor,
              letterSpacing: "0.04em",
              fontWeight: 500,
            }}
          >
            소송금융 투자심사 플랫폼
          </div>
          <div
            style={{
              fontSize: 11,
              color: isDark ? "rgba(255,255,255,0.25)" : "#94A3B8",
              marginTop: 4,
            }}
          >
            by ALEAN
          </div>
        </div>

        {error && (
          <Alert
            title={error}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="username"
            label={<span style={{ color: labelColor, fontSize: 13 }}>아이디</span>}
            rules={[{ required: true, message: "아이디를 입력하세요." }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#94A3B8" }} />}
              placeholder="아이디"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: labelColor, fontSize: 13 }}>비밀번호</span>}
            rules={[{ required: true, message: "비밀번호를 입력하세요." }]}
            style={{ marginBottom: 24 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#94A3B8" }} />}
              placeholder="비밀번호"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{ fontWeight: 600, letterSpacing: "0.02em" }}
            >
              로그인
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
