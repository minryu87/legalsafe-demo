/**
 * Pipeline Store
 * 파이프라인 실행 + 폴링
 */

import { create } from "zustand";
import type { BackendCaseStatus, PipelineStep } from "@/data/api-types";
import { startPipeline, getPipelineStatus, cancelPipeline } from "@/lib/api/pipeline";

interface PipelineState {
  status: BackendCaseStatus | null;
  steps: PipelineStep[];
  polling: boolean;
  startedAt: string | null;
  completedAt: string | null;
  error: string | null;

  startPipeline: (caseId: string, forceRestart?: boolean) => Promise<void>;
  fetchStatus: (caseId: string) => Promise<void>;
  startPolling: (caseId: string, intervalMs?: number) => void;
  stopPolling: () => void;
  cancelPipeline: (caseId: string) => Promise<void>;
  reset: () => void;
}

let pollingTimer: ReturnType<typeof setInterval> | null = null;

export const usePipelineStore = create<PipelineState>((set, get) => ({
  status: null,
  steps: [],
  polling: false,
  startedAt: null,
  completedAt: null,
  error: null,

  startPipeline: async (caseId, forceRestart = false) => {
    try {
      const res = await startPipeline(caseId, forceRestart);
      set({ status: res.status, error: null });
      // 시작 후 바로 폴링 시작
      get().startPolling(caseId);
    } catch (err) {
      set({ error: String(err) });
    }
  },

  fetchStatus: async (caseId) => {
    try {
      const res = await getPipelineStatus(caseId);
      set({
        status: res.status,
        steps: res.steps,
        startedAt: res.started_at,
        completedAt: res.completed_at,
        error: null,
      });
      // 완료/실패 시 폴링 중지
      if (res.status === "completed" || res.status === "failed") {
        get().stopPolling();
      }
    } catch (err) {
      set({ error: String(err) });
    }
  },

  startPolling: (caseId, intervalMs = 3000) => {
    get().stopPolling();
    set({ polling: true });
    // 즉시 1회 조회
    get().fetchStatus(caseId);
    pollingTimer = setInterval(() => {
      get().fetchStatus(caseId);
    }, intervalMs);
  },

  stopPolling: () => {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
    set({ polling: false });
  },

  cancelPipeline: async (caseId) => {
    try {
      await cancelPipeline(caseId);
      get().stopPolling();
      set({ status: "failed", error: null });
    } catch (err) {
      set({ error: String(err) });
    }
  },

  reset: () => {
    get().stopPolling();
    set({
      status: null,
      steps: [],
      polling: false,
      startedAt: null,
      completedAt: null,
      error: null,
    });
  },
}));
