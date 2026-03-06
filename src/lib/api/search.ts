/**
 * Search API
 */

import { apiFetch } from "./client";
import type {
  PrecedentGraphResponse,
  SemanticSearchResponse,
  CanonicalGraphResponse,
  CanonicalNodeDetailResponse,
} from "@/data/api-types";

export async function getGraphData(
  precedentId: string,
): Promise<PrecedentGraphResponse> {
  return apiFetch<PrecedentGraphResponse>(
    `/api/v1/search/graph/${precedentId}`,
  );
}

export async function semanticSearch(
  query: string,
  top_k = 10,
  source_type?: string,
  min_similarity = 0.5,
): Promise<SemanticSearchResponse> {
  return apiFetch<SemanticSearchResponse>("/api/v1/search/semantic", {
    method: "POST",
    body: { query, top_k, source_type, min_similarity },
  });
}

// ── Canonical Graph API ──

export async function getCanonicalGraph(): Promise<CanonicalGraphResponse> {
  return apiFetch<CanonicalGraphResponse>("/api/v1/search/canonical");
}

export async function getCaseCanonicalGraph(
  caseId: string,
): Promise<CanonicalGraphResponse> {
  return apiFetch<CanonicalGraphResponse>(
    `/api/v1/search/canonical/case/${caseId}`,
  );
}

export async function getCanonicalNodeDetail(
  canonicalId: string,
): Promise<CanonicalNodeDetailResponse> {
  return apiFetch<CanonicalNodeDetailResponse>(
    `/api/v1/search/canonical/${canonicalId}`,
  );
}
