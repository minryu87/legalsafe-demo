/**
 * Evidence API
 */

import { apiUpload, apiFetch } from "./client";
import type {
  EvidenceUploadResponse,
  EvidenceListResponse,
} from "@/data/api-types";

export async function uploadEvidence(
  caseId: string,
  files: File[],
): Promise<EvidenceUploadResponse> {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  return apiUpload<EvidenceUploadResponse>(
    `/api/v1/cases/${caseId}/evidences/`,
    formData,
  );
}

export async function listEvidence(
  caseId: string,
): Promise<EvidenceListResponse> {
  return apiFetch<EvidenceListResponse>(
    `/api/v1/cases/${caseId}/evidences/`,
  );
}
