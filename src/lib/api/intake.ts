/**
 * Intake API
 * 신청인/변호사 인테이크 API 클라이언트
 */

import { apiFetch } from "./client";
import type {
  ApplicantIntakeResponse,
  ApplicantIntakeDetailResponse,
  AttorneyIntakeResponse,
  AttorneyIntakeDetailResponse,
  SuccessResponse,
} from "@/data/api-types";

// ── 신청인 인테이크 ──

export interface ApplicantIntakePayload {
  applicant_name: string;
  applicant_phone: string;
  applicant_email?: string;
  attorney_name?: string;
  attorney_phone?: string;
  attorney_email?: string;
  attorney_firm?: string;
  dispute_background: string;
  desired_outcome: string;
  opponent_assets?: string;
  additional_comments?: string;
  consent: boolean;
}

export async function submitApplicantIntake(
  payload: ApplicantIntakePayload,
): Promise<ApplicantIntakeResponse> {
  return apiFetch<ApplicantIntakeResponse>("/api/v1/intake/applicant", {
    method: "POST",
    body: payload,
  });
}

export async function getApplicantIntake(
  caseId: string,
): Promise<ApplicantIntakeDetailResponse> {
  return apiFetch<ApplicantIntakeDetailResponse>(
    `/api/v1/intake/applicant/${caseId}`,
  );
}

// ── 변호사 인테이크 ──

export interface AttorneyIntakePayload {
  attorney_name: string;
  attorney_phone: string;
  attorney_email: string;
  attorney_reg_number: string;
  attorney_firm?: string;
  client_name: string;
  client_phone: string;
  facts: string;
  key_issues_and_laws: string;
  evidence_situation: string;
  unfavorable_factors?: string;
  expected_claims: string;
  cause_of_action: string;
  jurisdiction_info?: string;
  litigation_strategy: string;
  expected_duration?: string;
  estimated_costs?: string;
  expected_winning_amount?: string;
  enforcement_possibility?: string;
  settlement_possibility?: string;
  engagement_terms?: string;
  similar_case_experience?: string;
  consent: boolean;
}

export async function submitAttorneyIntake(
  caseId: string,
  payload: AttorneyIntakePayload,
): Promise<AttorneyIntakeResponse> {
  return apiFetch<AttorneyIntakeResponse>(
    `/api/v1/intake/attorney/${caseId}`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export async function getAttorneyIntake(
  caseId: string,
): Promise<AttorneyIntakeDetailResponse> {
  return apiFetch<AttorneyIntakeDetailResponse>(
    `/api/v1/intake/attorney/${caseId}`,
  );
}

// ── 인테이크 상태 관리 ──

export async function markIntakeReady(
  caseId: string,
): Promise<SuccessResponse> {
  return apiFetch<SuccessResponse>(
    `/api/v1/intake/${caseId}/mark-ready`,
    { method: "POST" },
  );
}
