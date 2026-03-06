/**
 * Report API
 */

import { apiFetch } from "./client";
import type { ReportResponse } from "@/data/api-types";

export async function getReport(
  caseId: string,
): Promise<ReportResponse> {
  return apiFetch<ReportResponse>(`/api/v1/reports/${caseId}`);
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function getReportDownloadUrl(caseId: string): string {
  return `${BASE_URL}/api/v1/reports/${caseId}/download`;
}
