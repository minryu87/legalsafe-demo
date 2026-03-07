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

// ── v3 종합 판단 (ScoringEngine) ──

export type ScoringGrade = "excellent" | "good" | "fair" | "risk";
export type FactorLevel = "high" | "medium" | "low";

export interface ScoringKeyFactor {
  factor: string;
  level: FactorLevel;
  detail: string;
}

export interface ScoringSummaryResponse {
  win_probability: number;
  grade: ScoringGrade;
  confidence: "high" | "medium" | "low";
  key_factors: ScoringKeyFactor[];
}

// ── v3 요건사실 구조 그래프 ──

export type LogicNodeType =
  | "domain"
  | "legal_effect"
  | "major_fact"
  | "indirect_fact"
  | "evidence"
  | "defense_argument";

export type AssessmentLevel = "good" | "bad" | "neutral" | "warning";
export type NodeSide = "applicant" | "opponent" | "court";

export interface PrecedentStat {
  satisfied_win: number;
  unsatisfied_lose: number;
  total_precedents: number;
}

export interface RelatedPrecedentRef {
  precedent_id: string;
  case_number: string;
  excerpt: string;
  court_accepted: boolean;
}

export interface LogicGraphNode {
  id: string;
  type: LogicNodeType;
  label: string;
  side: NodeSide;
  master_code: string | null;
  master_label: string | null;
  assessment: AssessmentLevel;
  assessment_reason: string;
  court_accepted: boolean | null;
  is_missing: boolean;
  precedent_stats: PrecedentStat | null;
  related_precedents: RelatedPrecedentRef[];
}

export interface LogicGraphEdge {
  source: string;
  target: string;
  type: "supports" | "requires" | "contradicts" | "proves";
  strength: "strong" | "moderate" | "weak";
  is_mapped: boolean;
}

export interface GapNode {
  master_code: string;
  master_label: string;
  importance: "required" | "recommended" | "optional";
  how_to_prove: string;
  winning_frequency: number;
  total_winning: number;
  precedent_examples: RelatedPrecedentRef[];
}

export interface StrengthItem {
  master_code: string;
  master_label: string;
  satisfied: boolean;
  precedent_ratio: string;
}

export interface VulnerabilityItemV3 {
  threat_type: string;
  risk_level: "high" | "medium" | "low";
  precedent_success_rate: number;
  precedent_count: number;
  client_can_rebut: boolean;
  rebuttal_evidence_needed: string;
  target_node_id: string;
}

export interface EvidenceGapV3 {
  master_code: string;
  master_label: string;
  importance: "required" | "recommended" | "optional";
  winning_frequency: number;
  total_winning: number;
  how_to_prove: string;
}

export interface OpponentArgument {
  node_id: string;
  defense_type: string;
  description: string;
  precedent_success_rate: number;
  precedent_count: number;
  risk_level: "high" | "medium" | "low";
  client_can_rebut: boolean;
  target_node_id: string;
}

export interface StrategySummaryV3 {
  strengths: StrengthItem[];
  vulnerabilities: VulnerabilityItemV3[];
  evidence_gaps: EvidenceGapV3[];
  opponent_arguments: OpponentArgument[];
}

export interface LogicGraphV3Response {
  nodes: LogicGraphNode[];
  edges: LogicGraphEdge[];
  gap_nodes: GapNode[];
  strategy_summary: StrategySummaryV3;
}

// ── v3 유사 판례 ──

export interface MatchedCodes {
  le_codes: string[];
  mf_codes: string[];
}

export interface SimilarPrecedent {
  precedent_id: string;
  case_number: string;
  court_level: number;
  is_favorable: boolean;
  outcome: string;
  ruling_date: string;
  similarity_score: number;
  chart_x: number;
  similarity_tier: number;
  matched_codes: MatchedCodes;
  structural_score: number;
  contextual_score: number;
  summary: string;
}

export interface TierInfo {
  count: number;
  description: string;
}

export interface SimilarPrecedentsResponse {
  total: number;
  tiers: Record<string, TierInfo>;
  precedents: SimilarPrecedent[];
}

// ── v3 판례 상세 그래프 ──

export interface PrecedentLogicNode {
  id: string;
  type: LogicNodeType;
  label: string;
  side: NodeSide;
  master_code: string | null;
  master_label: string | null;
  court_accepted: boolean | null;
  court_ruling_reason: string | null;
  is_mapped: boolean;
  overlaps_with_client: boolean;
  client_evidence_match: string | null;
}

export interface PrecedentLogicEdge {
  source: string;
  target: string;
  type: "supports" | "requires" | "contradicts" | "proves";
  strength: "strong" | "moderate" | "weak";
  is_mapped: boolean;
  court_ruling: "accepted" | "rejected" | null;
  ruling_reason: string | null;
}

export interface PrecedentLogicGraphResponse {
  precedent_id: string;
  case_number: string;
  court_level: number;
  outcome: string;
  ruling_summary: string;
  nodes: PrecedentLogicNode[];
  edges: PrecedentLogicEdge[];
}

// ── 공통 ──

export interface SuccessResponse {
  success: boolean;
  message: string;
}
