/**
 * Backend API Response Types
 * 백엔드 REST API 응답 스키마 정의
 */

// ── 백엔드 사건 상태 ──

export type BackendCaseStatus =
  | "pending"
  | "preprocessing"
  | "collecting_precedents"
  | "analyzing"
  | "simulating"
  | "generating_report"
  | "underwriting"
  | "completed"
  | "failed";

export type IntakeStatus =
  | "applicant_pending"
  | "applicant_submitted"
  | "attorney_pending"
  | "attorney_submitted"
  | "ready";

export type ReviewDecision = "approved" | "rejected" | "held";

// ── 사건 ──

export interface CaseResponse {
  case_id: string;
  desired_effect: string;
  context_description: string;
  status: BackendCaseStatus;
  intake_status: IntakeStatus;
  review_decision: ReviewDecision | null;
  created_at: string;
  updated_at: string;
}

export interface CaseDetailResponse extends CaseResponse {
  evidence_count: number;
  precedent_count: number;
}

export interface CaseListResponse {
  success: boolean;
  cases: CaseResponse[];
  total: number;
  page: number;
  limit: number;
}

// ── 증거 ──

export interface EvidenceResponse {
  evidence_id: string;
  case_id: string;
  file_name: string;
  file_type: string | null;
  extracted_text: string | null;
  created_at: string;
}

export interface EvidenceUploadResponse {
  success: boolean;
  uploaded: EvidenceResponse[];
  failed: string[];
}

export interface EvidenceListResponse {
  success: boolean;
  evidences: EvidenceResponse[];
  total: number;
}

// ── 파이프라인 ──

export interface PipelineStep {
  step: string;
  agent_type: string;
  status: "pending" | "running" | "completed" | "failed";
  started_at: string | null;
  completed_at: string | null;
}

export interface PipelineStatusResponse {
  success: boolean;
  case_id: string;
  status: BackendCaseStatus;
  steps: PipelineStep[];
  started_at: string | null;
  completed_at: string | null;
}

export interface PipelineStartResponse {
  success: boolean;
  case_id: string;
  status: BackendCaseStatus;
  message: string;
}

// ── 판례 ──

export interface PrecedentResponse {
  precedent_id: string;
  case_number: string;
  is_favorable: boolean | null;
  court_level: number;
  analysis_json: Record<string, unknown>;
  logic_graph_json: Record<string, unknown>;
}

export interface PrecedentListResponse {
  success: boolean;
  precedents: PrecedentResponse[];
  total: number;
}

// ── Neo4j 그래프 ──

export interface GraphNode {
  label: string;
  props: Record<string, unknown>;
}

export interface GraphEdge {
  from_label: string;
  relationship: string;
  to_label: string;
}

export interface PrecedentGraphResponse {
  precedent_id: string;
  node_count: number;
  edge_count: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ── Canonical 그래프 ──

export interface CanonicalGraphResponse {
  node_count: number;
  edge_count: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CanonicalNodeDetailResponse {
  canonical: GraphNode | null;
  mapped_nodes: Array<GraphNode & { precedent_id: string }>;
  relations: Array<{
    relationship: string;
    other_label: string;
    other_props: Record<string, unknown>;
    direction: "outgoing" | "incoming";
  }>;
  mapped_count: number;
}

// ── 보고서 ──

export interface ReportResponse {
  report_id: string;
  case_id: string;
  report_content: string;
  win_probability: number;
  created_at: string;
}

// ── 에이전트 로그 ──

export interface AgentLogResponse {
  log_id: string;
  agent_type: string;
  output_json: Record<string, unknown>;
  created_at: string;
}

export interface AgentLogListResponse {
  success: boolean;
  agent_logs: AgentLogResponse[];
  total: number;
}

// ── 언더라이팅 (기존 underwriting.ts에서 이동) ──

export interface BackendSPE {
  win_probability_score: number | null;
  win_probability_grade: string | null;
  duration_score: number | null;
  duration_grade: string | null;
  duration_months: number | null;
  recovery_score: number | null;
  recovery_grade: string | null;
  recovery_amount: number | null;
  cost_score: number | null;
  cost_grade: string | null;
  cost_total: number | null;
  collection_score: number | null;
  collection_grade: string | null;
  detail: Record<string, unknown> | null;
}

export interface BackendLVE {
  portfolio_score: number | null;
  portfolio_grade: string | null;
  reputation_score: number | null;
  reputation_grade: string | null;
  overall_grade: string | null;
  detail: Record<string, unknown> | null;
}

export interface BackendFDA {
  total_score: number | null;
  grade: string | null;
  decision: "Go" | "Conditional_Go" | "No_Go" | null;
  detail: Record<string, unknown> | null;
}

export interface BackendCTA {
  advance_rate: number | null;
  interest_rate: number | null;
  profit_share_rate: number | null;
  detail: Record<string, unknown> | null;
}

export interface UnderwritingResponse {
  underwriting_id: string;
  case_id: string;
  spe: BackendSPE;
  lve: BackendLVE;
  fda: BackendFDA;
  cta: BackendCTA | null;
  pipeline_version: string | null;
  data_completeness: number | null;
  created_at: string;
  updated_at: string;
}

// ── 검색 ──

export interface SemanticSearchResult {
  embedding_id: string;
  source_type: string;
  source_id: string;
  chunk_index: number;
  text_content: string;
  similarity: number;
  metadata: Record<string, unknown> | null;
}

export interface SemanticSearchResponse {
  results: SemanticSearchResult[];
  total: number;
  query: string;
}

// ── 인테이크 ──

export interface ApplicantIntakeResponse {
  case_id: string;
  applicant_id: string;
  intake_status: IntakeStatus;
  created_at: string;
}

export interface ApplicantIntakeDetailResponse {
  intake_id: string;
  case_id: string;
  dispute_background: string;
  desired_outcome: string;
  opponent_assets: string | null;
  additional_comments: string | null;
  consent_given: boolean;
  created_at: string;
  applicant_name: string;
  applicant_phone: string;
  applicant_email: string | null;
  attorney_name: string | null;
  attorney_phone: string | null;
  attorney_email: string | null;
  attorney_firm: string | null;
}

export interface AttorneyIntakeResponse {
  case_id: string;
  attorney_id: string;
  intake_status: IntakeStatus;
  created_at: string;
}

export interface AttorneyIntakeDetailResponse {
  intake_id: string;
  case_id: string;
  facts: string;
  key_issues_and_laws: string;
  evidence_situation: string;
  unfavorable_factors: string | null;
  expected_claims: string;
  cause_of_action: string;
  jurisdiction_info: string | null;
  litigation_strategy: string;
  expected_duration: string | null;
  estimated_costs: string | null;
  expected_winning_amount: string | null;
  enforcement_possibility: string | null;
  settlement_possibility: string | null;
  engagement_terms: string | null;
  similar_case_experience: string | null;
  consent_given: boolean;
  created_at: string;
  attorney_name: string;
  attorney_phone: string;
  attorney_email: string | null;
  attorney_reg_number: string | null;
  attorney_firm: string | null;
}

// ── 공통 ──

export interface SuccessResponse {
  success: boolean;
  message: string;
}
