import { create } from "zustand";
import { Notification } from "@/data/types";

const initialNotifications: Notification[] = [
  { id: 1, type: "NEW_APPLICATION", caseId: "LS-2026-001", message: "김철수 님의 부당해고 임금 청구 소송 신규 접수", read: false, timestamp: "2026-02-27T09:00:00" },
  { id: 2, type: "REVIEW_READY", caseId: "LS-2026-006", message: "프리랜서 퇴직금 건 1차 AI 심사 완료. 검토 요망", read: false, timestamp: "2026-02-27T08:30:00" },
  { id: 3, type: "CONTRACT_SIGNED", caseId: "LS-2026-011", message: "미디어웍스 건 신청인 전자서명 완료", read: false, timestamp: "2026-02-26T17:00:00" },
  { id: 4, type: "COURT_UPDATE", caseId: "LS-2026-012", message: "[대법원 연동] 피고 준비서면 제출", read: true, timestamp: "2026-02-25T14:00:00" },
  { id: 5, type: "FINANCE_ALERT", caseId: "LS-2026-017", message: "강호동 건 승소금 회수 3일 지연", read: false, timestamp: "2026-02-27T10:00:00" },
];

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: initialNotifications,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        { ...notification, id: Math.max(0, ...state.notifications.map((n) => n.id)) + 1 },
        ...state.notifications,
      ],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
