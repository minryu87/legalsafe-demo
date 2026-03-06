/**
 * Case Detail Store
 * 사건 상세 + 증거 관리
 */

import { create } from "zustand";
import type { CaseDetailResponse, EvidenceResponse } from "@/data/api-types";
import { getCaseDetail } from "@/lib/api/cases";
import { listEvidence, uploadEvidence } from "@/lib/api/evidence";

interface CaseDetailState {
  caseDetail: CaseDetailResponse | null;
  evidences: EvidenceResponse[];
  loading: boolean;
  error: string | null;

  fetchCaseDetail: (caseId: string) => Promise<void>;
  fetchEvidences: (caseId: string) => Promise<void>;
  uploadEvidence: (caseId: string, files: File[]) => Promise<void>;
  reset: () => void;
}

export const useCaseDetailStore = create<CaseDetailState>((set) => ({
  caseDetail: null,
  evidences: [],
  loading: false,
  error: null,

  fetchCaseDetail: async (caseId) => {
    set({ loading: true, error: null });
    try {
      const detail = await getCaseDetail(caseId);
      set({ caseDetail: detail, loading: false });
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  fetchEvidences: async (caseId) => {
    try {
      const res = await listEvidence(caseId);
      set({ evidences: res.evidences });
    } catch {
      // silently fail — evidence tab can show empty state
    }
  },

  uploadEvidence: async (caseId, files) => {
    const res = await uploadEvidence(caseId, files);
    if (res.uploaded.length > 0) {
      set((state) => ({
        evidences: [...state.evidences, ...res.uploaded],
      }));
    }
  },

  reset: () =>
    set({ caseDetail: null, evidences: [], loading: false, error: null }),
}));
