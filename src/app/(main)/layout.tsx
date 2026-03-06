"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthStore } from "@/stores/useAuthStore";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  if (!_hasHydrated) return null;
  if (!isAuthenticated) return null;

  return (
    <>
      <Sidebar />
      <div style={{ marginLeft: 220, minHeight: "100vh" }}>
        <main style={{ padding: 24 }}>{children}</main>
      </div>
    </>
  );
}
