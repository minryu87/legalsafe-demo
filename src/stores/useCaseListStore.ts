/**
 * Case List Store
 * 사건 목록 조회 + 신규 사건 생성
 */

import { create } from "zustand";
import type { CaseResponse } from "@/data/api-types";
import { listCases, createCase } from "@/lib/api/cases";

interface CaseListState {
  cases: CaseResponse[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;

  fetchCases: (page?: number, limit?: number, status?: string) => Promise<void>;
  createCase: (desired_effect: string, context_description: string) => Promise<string>;
}

export const useCaseListStore = create<CaseListState>((set) => ({
  cases: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,

  fetchCases: async (page = 1, limit = 20, status?: string) => {
    set({ loading: true, error: null });
    try {
      const res = await listCases(page, limit, status);
      set({ cases: res.cases, total: res.total, page: res.page, loading: false });
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  createCase: async (desired_effect, context_description) => {
    const res = await createCase(desired_effect, context_description);
    return res.case_id;
  },
}));
