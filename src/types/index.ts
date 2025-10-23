// TypeScript type definitions
// This file contains all shared TypeScript types and interfaces

// Agent analysis result for one node
export interface AgentAnalysis {
  name: string; // "PatternDetector", "BehavioralAnalyzer", etc.
  risk_score: number; // 0-100
  findings: string[];
  recommendation: "APPROVE" | "DECLINE";
  confidence: number; // 0.0-1.0
  reasoning: string;
}

// Complete multi-agent result
export interface FraudAnalysisResult {
  transaction: Transaction;
  decision: "APPROVE" | "DECLINE";
  confidence: number;
  risk_score: number;
  reasoning: string;
  analyzer_results: {
    PatternDetector: AgentAnalysis;
    BehavioralAnalyzer: AgentAnalysis;
    VelocityChecker: AgentAnalysis;
    MerchantRiskAnalyzer: AgentAnalysis;
    GeographicAnalyzer: AgentAnalysis;
  };
  risk_breakdown: {
    [key: string]: {
      score: number;
      contribution: number;
      findings_count: number;
    };
  };
  timestamp: string;
}

// Transaction input
export interface Transaction {
  user_id: string;
  user_age_days: number;
  total_transactions: number;
  amount: number;
  time: string;
  merchant: string;
  merchant_rating: number;
  merchant_fraud_reports: number;
  location: string;
  previous_location?: string;
}

// Experiment result (for comparison)
export interface ExperimentResult {
  mode: "vanilla" | "offline_ace" | "online_ace";
  problems_processed: number;
  final_accuracy: number;
  iteration_metrics: IterationMetric[];
  playbook_size: number;
  execution_time: number;
}

export interface IterationMetric {
  iteration: number;
  accuracy: number;
  playbook_size: number;
  is_correct: boolean;
}

// Playbook bullet
export interface Bullet {
  id: string;
  content: string;
  node: string; // Which analyzer node uses this
  helpful_count: number;
  harmful_count: number;
  success_rate: number;
  times_selected: number;
  created_at: string;
}

