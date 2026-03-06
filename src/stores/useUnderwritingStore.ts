/**
 * Underwriting Store
 * 백엔드 언더라이팅 결과 조회 (mock 없음)
 */

import { create } from "zustand";
import type { FdaDetail } from "@/data/types";
import type { UnderwritingResponse } from "@/data/api-types";
import { fetchUnderwriting, toFdaDetail } from "@/lib/api/underwriting";
import { ApiError } from "@/lib/api/client";

interface UnderwritingState {
  fdaDetail: FdaDetail | null;
  raw: UnderwritingResponse | null;
  loading: boolean;
  error: string | null;

  fetchUnderwriting: (caseId: string) => Promise<void>;
  reset: () => void;
}

export const useUnderwritingStore = create<UnderwritingState>((set) => ({
  fdaDetail: null,
  raw: null,
  loading: false,
  error: null,

  fetchUnderwriting: async (caseId) => {
    set({ loading: true, error: null });
    try {
      const uw = await fetchUnderwriting(caseId);
      const detail = toFdaDetail(uw);
      set({ fdaDetail: detail, raw: uw, loading: false });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? `API 오류 (${err.status})`
          : "네트워크 오류";
      set({ fdaDetail: null, raw: null, loading: false, error: msg });
    }
  },

  reset: () =>
    set({ fdaDetail: null, raw: null, loading: false, error: null }),
}));
