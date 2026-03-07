/**
 * Analysis Store
 * 판례 + 전략 + 보고서 + 그래프 데이터 + v3 API
 */

import { create } from "zustand";
import type {
  PrecedentResponse,
  ReportResponse,
  PrecedentGraphResponse,
  ScoringSummaryResponse,
  LogicGraphV3Response,
  SimilarPrecedentsResponse,
} from "@/data/api-types";
import type { StrategySimulation } from "@/data/types";
import { listPrecedents, getAgentLogByType } from "@/lib/api/debug";
import { getReport } from "@/lib/api/report";
import { getGraphData } from "@/lib/api/search";
import {
  getScoringSummary,
  getLogicGraphV3,
  getSimilarPrecedents,
} from "@/lib/api/analysis-v3";

interface AnalysisState {
  precedents: PrecedentResponse[];
  strategy: StrategySimulation | null;
  report: ReportResponse | null;
  graphData: PrecedentGraphResponse | null;
  // v3
  scoringSummary: ScoringSummaryResponse | null;
  logicGraphV3: LogicGraphV3Response | null;
  similarPrecedents: SimilarPrecedentsResponse | null;
  loading: Record<string, boolean>;

  fetchPrecedents: (caseId: string) => Promise<void>;
  fetchStrategy: (caseId: string) => Promise<void>;
  fetchReport: (caseId: string) => Promise<void>;
  fetchGraph: (precedentId: string) => Promise<void>;
  fetchScoringSummary: (caseId: string) => Promise<void>;
  fetchLogicGraphV3: (caseId: string) => Promise<void>;
  fetchSimilarPrecedents: (caseId: string) => Promise<void>;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  precedents: [],
  strategy: null,
  report: null,
  graphData: null,
  scoringSummary: null,
  logicGraphV3: null,
  similarPrecedents: null,
  loading: {},

  fetchPrecedents: async (caseId) => {
    set((s) => ({ loading: { ...s.loading, precedents: true } }));
    try {
      const res = await listPrecedents(caseId);
      set((s) => ({
        precedents: res.precedents,
        loading: { ...s.loading, precedents: false },
      }));
    } catch {
      set((s) => ({ loading: { ...s.loading, precedents: false } }));
    }
  },

  fetchStrategy: async (caseId) => {
    set((s) => ({ loading: { ...s.loading, strategy: true } }));
    try {
      const res = await getAgentLogByType(caseId, "strategy_simulation");
      if (res.agent_logs.length > 0) {
        const raw = res.agent_logs[0].output_json as Record<string, unknown>;
        const d = (raw.data ?? raw) as Record<string, unknown>;
        // snake_case → camelCase 변환
        const strategy: StrategySimulation = {
          goldenPaths: ((d.golden_paths ?? []) as Record<string, unknown>[]).map((p) => ({
            rank: p.rank as number,
            argument: (p.argument as string) ?? "",
            rationale: (p.rationale as string) ?? "",
            legalBasis: (p.legal_basis as string) ?? "",
            supportingEvidence: (p.supporting_evidence as string[]) ?? [],
            acceptanceRate: (p.acceptance_rate as number) ?? 0,
          })),
          vulnerabilities: ((d.vulnerability_analysis ?? []) as Record<string, unknown>[]).map((v) => ({
            targetArgument: (v.target_argument as string) ?? "",
            counterargument: (v.counterargument as string) ?? "",
            counterSuccessRate: (v.counter_success_rate as number) ?? 0,
            counterCount: (v.counter_count as number) ?? 0,
            mitigation: (v.mitigation as string) ?? "",
          })),
          evidenceGaps: ((d.evidence_gaps ?? []) as Record<string, unknown>[]).map((e) => ({
            evidenceType: (e.evidence_type as string) ?? "",
            importance: (e.importance as "high" | "medium" | "low") ?? "medium",
            acceptanceBoost: (e.acceptance_boost as number) ?? 0,
            userHas: (e.user_has as boolean) ?? false,
            recommendation: (e.recommendation as string) ?? "",
          })),
          strategySummary: (d.strategy_summary as string) ?? "",
          winPathProbability: (d.win_path_probability as number) ?? null,
        };
        set((s) => ({
          strategy,
          loading: { ...s.loading, strategy: false },
        }));
      } else {
        set((s) => ({ loading: { ...s.loading, strategy: false } }));
      }
    } catch {
      set((s) => ({ loading: { ...s.loading, strategy: false } }));
    }
  },

  fetchReport: async (caseId) => {
    set((s) => ({ loading: { ...s.loading, report: true } }));
    try {
      const res = await getReport(caseId);
      set((s) => ({
        report: res,
        loading: { ...s.loading, report: false },
      }));
    } catch {
      set((s) => ({ loading: { ...s.loading, report: false } }));
    }
  },

  fetchGraph: async (precedentId) => {
    set((s) => ({ loading: { ...s.loading, graph: true } }));
    try {
      const res = await getGraphData(precedentId);
      set((s) => ({
        graphData: res,
        loading: { ...s.loading, graph: false },
      }));
    } catch {
      set((s) => ({ loading: { ...s.loading, graph: false } }));
    }
  },

  fetchScoringSummary: async (caseId) => {
    set((s) => ({ loading: { ...s.loading, scoring: true } }));
    try {
      const res = await getScoringSummary(caseId);
      set((s) => ({
        scoringSummary: res,
        loading: { ...s.loading, scoring: false },
      }));
    } catch {
      set((s) => ({ loading: { ...s.loading, scoring: false } }));
    }
  },

  fetchLogicGraphV3: async (caseId) => {
    set((s) => ({ loading: { ...s.loading, logicGraphV3: true } }));
    try {
      const res = await getLogicGraphV3(caseId);
      set((s) => ({
        logicGraphV3: res,
        loading: { ...s.loading, logicGraphV3: false },
      }));
    } catch {
      set((s) => ({ loading: { ...s.loading, logicGraphV3: false } }));
    }
  },

  fetchSimilarPrecedents: async (caseId) => {
    set((s) => ({ loading: { ...s.loading, similarPrecedents: true } }));
    try {
      const res = await getSimilarPrecedents(caseId);
      set((s) => ({
        similarPrecedents: res,
        loading: { ...s.loading, similarPrecedents: false },
      }));
    } catch {
      set((s) => ({ loading: { ...s.loading, similarPrecedents: false } }));
    }
  },

  reset: () =>
    set({
      precedents: [],
      strategy: null,
      report: null,
      graphData: null,
      scoringSummary: null,
      logicGraphV3: null,
      similarPrecedents: null,
      loading: {},
    }),
}));
