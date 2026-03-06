/**
 * Cases API
 */

import { apiFetch } from "./client";
import type {
  CaseResponse,
  CaseDetailResponse,
  CaseListResponse,
  ReviewDecision,
  SuccessResponse,
} from "@/data/api-types";

export async function createCase(
  desired_effect: string,
  context_description: string,
): Promise<CaseResponse> {
  return apiFetch<CaseResponse>("/api/v1/cases/", {
    method: "POST",
    body: { desired_effect, context_description },
  });
}

export async function listCases(
  page = 1,
  limit = 20,
  status?: string,
): Promise<CaseListResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set("status", status);
  return apiFetch<CaseListResponse>(`/api/v1/cases/?${params}`);
}

export async function getCaseDetail(
  caseId: string,
): Promise<CaseDetailResponse> {
  return apiFetch<CaseDetailResponse>(`/api/v1/cases/${caseId}`);
}

export async function setReviewDecision(
  caseId: string,
  decision: ReviewDecision,
): Promise<CaseResponse> {
  return apiFetch<CaseResponse>(`/api/v1/cases/${caseId}/review-decision`, {
    method: "POST",
    body: { decision },
  });
}

export async function deleteCase(
  caseId: string,
): Promise<SuccessResponse> {
  return apiFetch<SuccessResponse>(`/api/v1/cases/${caseId}`, {
    method: "DELETE",
  });
}
