/**
 * Pipeline API
 */

import { apiFetch } from "./client";
import type {
  PipelineStartResponse,
  PipelineStatusResponse,
  SuccessResponse,
} from "@/data/api-types";

export async function startPipeline(
  case_id: string,
  force_restart = false,
): Promise<PipelineStartResponse> {
  return apiFetch<PipelineStartResponse>("/api/v1/pipeline/start", {
    method: "POST",
    body: { case_id, force_restart },
  });
}

export async function getPipelineStatus(
  caseId: string,
): Promise<PipelineStatusResponse> {
  return apiFetch<PipelineStatusResponse>(
    `/api/v1/pipeline/status/${caseId}`,
  );
}

export async function cancelPipeline(
  caseId: string,
): Promise<SuccessResponse> {
  return apiFetch<SuccessResponse>(
    `/api/v1/pipeline/cancel/${caseId}`,
    { method: "POST" },
  );
}
