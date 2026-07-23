/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Issuer {
  id: string;
  name: string;
  sector: string;
  country: string;
  ticker: string;
  rating: string;
  opportunityScore: number;
  trend: "up" | "stable" | "down";
  suggestedProduct: string;
  indicativeWindow: string;
  nextAction: string;
  assignedBanker: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  fundingNeed: number;
  marketFeasibility: number;
  dataConfidence: number;
  relationshipReadiness: number;
  lastUpdated: string;
  debtToEbitda: number;
  ebitdaInterestCoverage: number;
  liquidityPosition: string;
  refinancingDue: string;
  marketCap: string;
  aiDrivers: string[];
  positiveSignals: string[];
  supportingEvidence: string[];
  counterSignals: string[];
  missingData: string[];
  risks: string[];
  recommendation: {
    suggestedProduct: string;
    indicativeWindow: string;
    illustrativeStructure: string;
    keyTerms: string[];
    recommendedTeams: string[];
    recommendedNextAction: string;
  };
  scoreBreakdown: {
    relationshipIntelligence: ScoreDetail;
    creditSignals: ScoreDetail;
    marketSignals: ScoreDetail;
    financialHealth: ScoreDetail;
    historicalSimilarity: ScoreDetail;
    newsIntelligence: ScoreDetail;
    macroSignals: ScoreDetail;
  };
}

export interface ScoreDetail {
  score: number;
  contribution: number;
  confidence: number;
  evidence: string;
  reasoning: string;
}

export interface GraphNode{

    id:string;

    label:string;

    type:string;

    x:number;

    y:number;

    sector:string;

    country:string;

    rating:string;

    ticker:string;

    description:string;

}

export interface GraphLink{

    source:string;

    target:string;

    label:string;

}
export interface MarketIndicator {
  id: string;
  name: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  influence: string;
}

export interface Alert {
  id: string;
  issuerId: string;
  issuerName: string;
  type: "RATING_UPGRADE" | "RATING_DOWNGRADE" | "DEBT_MATURITY" | "EXPANSION" | "ACQUISITION" | "CEO_CHANGE" | "EARNINGS_SURPRISE" | "MARKET_WINDOW" | "RELATIONSHIP_UPDATE";
  title: string;
  message: string;
  urgency: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  timestamp: string;
  whyItMatters: string;
  aiReasoning: string;
  suggestedAction: string;
}

export interface MyAction {
  id: string;
  issuerId: string;
  issuerName: string;
  type: "Assigned Review" | "Contact Client" | "Prepare Pitch" | "Generate Brief" | "Upcoming Meeting";
  title: string;
  description: string;
  dueDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  owner: string;
}
