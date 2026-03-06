/**
 * Debug API
 */

import { apiFetch } from "./client";
import type {
  PrecedentListResponse,
  AgentLogListResponse,
  EvidenceListResponse,
} from "@/data/api-types";

export async function listPrecedents(
  caseId: string,
  favorable?: boolean,
): Promise<PrecedentListResponse> {
  const params = new URLSearchParams();
  if (favorable !== undefined) params.set("favorable", String(favorable));
  const qs = params.toString();
  return apiFetch<PrecedentListResponse>(
    `/api/v1/debug/cases/${caseId}/precedents${qs ? `?${qs}` : ""}`,
  );
}

export async function getAgentLogs(
  caseId: string,
): Promise<AgentLogListResponse> {
  return apiFetch<AgentLogListResponse>(
    `/api/v1/debug/cases/${caseId}/agents`,
  );
}

export async function getAgentLogByType(
  caseId: string,
  agentType: string,
): Promise<AgentLogListResponse> {
  return apiFetch<AgentLogListResponse>(
    `/api/v1/debug/cases/${caseId}/agents/${agentType}`,
  );
}

export async function getOcrResults(
  caseId: string,
): Promise<EvidenceListResponse> {
  return apiFetch<EvidenceListResponse>(
    `/api/v1/debug/cases/${caseId}/ocr`,
  );
}
