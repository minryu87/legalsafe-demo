import { create } from "zustand";
import { Case, CaseStatus } from "@/data/types";
import { cases as initialCases } from "@/data/cases";

interface CaseStore {
  cases: Case[];
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;
  updateStatus: (caseId: string, status: CaseStatus) => void;
  updateCase: (caseId: string, updates: Partial<Case>) => void;
  getCaseById: (caseId: string) => Case | undefined;
  getCasesByStatus: (statuses: CaseStatus[]) => Case[];
}

export const useCaseStore = create<CaseStore>((set, get) => ({
  cases: initialCases,
  selectedCaseId: null,

  setSelectedCaseId: (id) => set({ selectedCaseId: id }),

  updateStatus: (caseId, status) =>
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId ? { ...c, status, updatedAt: new Date().toISOString() } : c
      ),
    })),

  updateCase: (caseId, updates) =>
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    })),

  getCaseById: (caseId) => get().cases.find((c) => c.id === caseId),

  getCasesByStatus: (statuses) =>
    get().cases.filter((c) => statuses.includes(c.status)),
}));
