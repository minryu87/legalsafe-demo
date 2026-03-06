/**
 * FDA Override Store
 * SPE/LVE 각 항목의 수동 Override 값 관리 + 실시간 가중치 재산출
 */

import { create } from "zustand";
import type { Grade, Decision, FdaDetail } from "@/data/types";

// ── 가중치 정의 ──

export const FDA_WEIGHTS = {
  winProbability: 0.30,
  recovery: 0.20,
  duration: 0.15,
  collection: 0.10,
  cost: 0.10,
  mediaInfluence: 0.03,
  dataEnhancement: 0.03,
  portfolioDiversification: 0.03,
  strategicMarket: 0.03,
  strategicNetwork: 0.03,
} as const;

export type OverrideKey = keyof typeof FDA_WEIGHTS;

export const OVERRIDE_LABELS: Record<OverrideKey, string> = {
  winProbability: "승소가능성",
  duration: "소송기간",
  recovery: "승소금액",
  collection: "집행난이도",
  cost: "소송비용",
  mediaInfluence: "미디어 영향도",
  dataEnhancement: "데이터 고도화",
  portfolioDiversification: "포트폴리오 다각화",
  strategicMarket: "전략적 시장 선점",
  strategicNetwork: "전략적 네트워크",
};

// ── Grade → Score 변환 ──

export function gradeToScore(grade: Grade): number {
  switch (grade) {
    case "A": return 90;
    case "B": return 75;
    case "C": return 55;
    case "D": return 30;
  }
}

export function scoreToGrade(score: number): Grade {
  if (score >= 85) return "A";
  if (score >= 65) return "B";
  if (score >= 45) return "C";
  return "D";
}

export function scoreToDecision(score: number): Decision {
  if (score >= 70) return "Y";
  if (score >= 50) return "CONDITIONAL_Y";
  return "N";
}

// ── Store ──

export interface OverrideEntry {
  score: number;     // Override한 점수 (0-100)
  reason?: string;   // Override 사유 (선택)
}

interface ComputedResult {
  categoryScores: Record<OverrideKey, { original: number; effective: number; isOverridden: boolean }>;
  totalScore: number;
  grade: Grade;
  decision: Decision;
  originalTotalScore: number;
  originalGrade: Grade;
  originalDecision: Decision;
}

interface FdaOverrideState {
  overrides: Partial<Record<OverrideKey, OverrideEntry>>;
  setOverride: (key: OverrideKey, score: number, reason?: string) => void;
  clearOverride: (key: OverrideKey) => void;
  clearAll: () => void;
  compute: (detail: FdaDetail) => ComputedResult;
}

function extractOriginalScores(detail: FdaDetail): Record<OverrideKey, number> {
  return {
    winProbability: gradeToScore(detail.spe.winRateAnalysis.overallGrade),
    duration: gradeToScore(detail.spe.durationAnalysis.grade),
    recovery: gradeToScore(detail.spe.recoveryAnalysis.grade),
    collection: gradeToScore(detail.spe.collectionAnalysis.grade),
    cost: gradeToScore(detail.spe.costAnalysis.grade),
    mediaInfluence: gradeToScore(detail.lve.mediaInfluence.grade),
    dataEnhancement: gradeToScore(detail.lve.dataEnhancement.grade),
    portfolioDiversification: gradeToScore(detail.lve.portfolioDiversification.grade),
    strategicMarket: gradeToScore(detail.lve.strategicMarket.grade),
    strategicNetwork: gradeToScore(detail.lve.strategicNetwork.grade),
  };
}

export const useFdaOverrideStore = create<FdaOverrideState>((set, get) => ({
  overrides: {},

  setOverride: (key, score, reason) =>
    set((s) => ({
      overrides: { ...s.overrides, [key]: { score, reason } },
    })),

  clearOverride: (key) =>
    set((s) => {
      const next = { ...s.overrides };
      delete next[key];
      return { overrides: next };
    }),

  clearAll: () => set({ overrides: {} }),

  compute: (detail) => {
    const { overrides } = get();
    const originals = extractOriginalScores(detail);

    const categoryScores = {} as ComputedResult["categoryScores"];
    let totalScore = 0;
    let originalTotalScore = 0;

    for (const key of Object.keys(FDA_WEIGHTS) as OverrideKey[]) {
      const original = originals[key];
      const override = overrides[key];
      const effective = override ? override.score : original;
      const weight = FDA_WEIGHTS[key];

      categoryScores[key] = {
        original,
        effective,
        isOverridden: !!override,
      };

      totalScore += effective * weight;
      originalTotalScore += original * weight;
    }

    return {
      categoryScores,
      totalScore: Math.round(totalScore * 10) / 10,
      grade: scoreToGrade(totalScore),
      decision: scoreToDecision(totalScore),
      originalTotalScore: Math.round(originalTotalScore * 10) / 10,
      originalGrade: scoreToGrade(originalTotalScore),
      originalDecision: scoreToDecision(originalTotalScore),
    };
  },
}));
