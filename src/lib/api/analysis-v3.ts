/**
 * Analysis v3 API
 * Pipeline 3.0 백엔드 엔드포인트
 */

import { apiFetch } from "./client";
import type {
  ScoringSummaryResponse,
  LogicGraphV3Response,
  SimilarPrecedentsResponse,
  PrecedentLogicGraphResponse,
} from "@/data/api-types";

export async function getScoringSummary(
  caseId: string,
): Promise<ScoringSummaryResponse> {
  return apiFetch<ScoringSummaryResponse>(
    `/api/v1/cases/${caseId}/scoring-summary`,
  );
}

export async function getLogicGraphV3(
  caseId: string,
): Promise<LogicGraphV3Response> {
  return apiFetch<LogicGraphV3Response>(
    `/api/v1/cases/${caseId}/logic-graph`,
  );
}

export async function getSimilarPrecedents(
  caseId: string,
  tier?: number,
  outcome?: string,
  leCode?: string,
): Promise<SimilarPrecedentsResponse> {
  const params = new URLSearchParams();
  if (tier !== undefined) params.set("tier", String(tier));
  if (outcome) params.set("outcome", outcome);
  if (leCode) params.set("le_code", leCode);
  const qs = params.toString();
  return apiFetch<SimilarPrecedentsResponse>(
    `/api/v1/cases/${caseId}/similar-precedents${qs ? `?${qs}` : ""}`,
  );
}

export async function getPrecedentLogicGraph(
  precedentId: string,
  caseId: string,
): Promise<PrecedentLogicGraphResponse> {
  return apiFetch<PrecedentLogicGraphResponse>(
    `/api/v1/precedents/${precedentId}/logic-graph?case_id=${caseId}`,
  );
}
