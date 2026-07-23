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
  rating: string; // S&P / Moody's rating
  opportunityScore: number;
  trend: "up" | "stable" | "down";
  suggestedProduct: string;
  indicativeWindow: string;
  nextAction: string;
  assignedBanker: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  
  // Detailed metrics
  fundingNeed: number; // in Millions EUR
  marketFeasibility: number; // Percentage 0-100
  dataConfidence: number; // Percentage 0-100
  relationshipReadiness: number; // Percentage 0-100
  lastUpdated: string;
  
  // Financial Indicators
  debtToEbitda: number;
  ebitdaInterestCoverage: number;
  liquidityPosition: string; // e.g. "Excellent", "Adequate"
  refinancingDue: string; // Date or year (e.g. "Q1 2027")
  marketCap: string; // e.g. "85.2B EUR"
  
  // AI Drivers
  aiDrivers: string[];
  positiveSignals: string[];
  supportingEvidence: string[];
  
  // Counter Signals / Risks
  counterSignals: string[];
  missingData: string[];
  risks: string[];
  
  // Detailed Recommendation Structure
  recommendation: {
    suggestedProduct: string;
    indicativeWindow: string;
    illustrativeStructure: string;
    keyTerms: string[];
    recommendedTeams: string[];
    recommendedNextAction: string;
  };
  
  // Score breakdown
  scoreBreakdown: {
    relationshipIntelligence: { score: number; contribution: number; confidence: number; evidence: string; reasoning: string };
    creditSignals: { score: number; contribution: number; confidence: number; evidence: string; reasoning: string };
    marketSignals: { score: number; contribution: number; confidence: number; evidence: string; reasoning: string };
    financialHealth: { score: number; contribution: number; confidence: number; evidence: string; reasoning: string };
    historicalSimilarity: { score: number; contribution: number; confidence: number; evidence: string; reasoning: string };
    newsIntelligence: { score: number; contribution: number; confidence: number; evidence: string; reasoning: string };
    macroSignals: { score: number; contribution: number; confidence: number; evidence: string; reasoning: string };
  };
}

export interface GraphNode {
  id: string;
  label: string;
  type: "issuer" | "banker" | "deal" | "investor" | "peer" | "sector" | "rating" | "debt" | "event";
  group?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
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

// Complete mock database
export const ISSUERS: Issuer[] = [
  {
    id: "airbus",
    name: "Airbus SE",
    sector: "Aerospace & Defense",
    country: "France",
    ticker: "AIR FP",
    rating: "A2 / A Stable",
    opportunityScore: 94,
    trend: "up",
    suggestedProduct: "Green Bond (EUR 1.5B)",
    indicativeWindow: "Q4 2026",
    nextAction: "Present Green Financing Framework Pitch",
    assignedBanker: "Jean-Pierre Laurent (M&A Aerospace)",
    priority: "CRITICAL",
    fundingNeed: 1500,
    marketFeasibility: 96,
    dataConfidence: 91,
    relationshipReadiness: 88,
    lastUpdated: "2026-07-20T08:15:00Z",
    debtToEbitda: 1.4,
    ebitdaInterestCoverage: 12.5,
    liquidityPosition: "Excellent (EUR 14.2B cash)",
    refinancingDue: "EUR 2.0B maturing Q2 2027",
    marketCap: "112.4B EUR",
    aiDrivers: [
      "Decarbonization mandate for fleet renewal requiring capital expenditure of EUR 3.2B over 18 months",
      "Current EUR-denominated yield curve pricing spreads for A2 credits are near historical lows (spreads tightened by 12bps last week)",
      "High historical correlation with green bond issuances by peer industrial companies"
    ],
    positiveSignals: [
      "ECB corporate sector purchase guidelines heavily favor sustainable aviation fuels (SAF) investment frameworks",
      "Recent successful transition bond by Safran SE (oversubscribed by 4.2x)",
      "Airbus recently registered its updated Euro Medium Term Note (EMTN) program"
    ],
    supportingEvidence: [
      "Airbus ESG disclosure scored in top 5% of industrials (Sustainalytics: 11.2 low risk)",
      "French government backed research credits for hydrogen propulsion (ZEROe) announced yesterday"
    ],
    counterSignals: [
      "Supply chain bottlenecks for Leap engines delaying delivery schedules, potentially reducing short term working capital turnover",
      "Strong existing cash balance reduces absolute urgency for financing, client may demand aggressive pricing terms"
    ],
    missingData: [
      "Detailed allocation plan for previous private placement ESG tranches is undisclosed",
      "Specific hedging ratios on EUR/USD exports for late 2026 are self-declared but not validated"
    ],
    risks: [
      "Eurozone interest rate volatility could spike ahead of upcoming ECB policy rate decision in September",
      "USD weakness could compress operating margins (Airbus expenses are largely in EUR but sells primarily in USD)"
    ],
    recommendation: {
      suggestedProduct: "Dual-Tranche Green Bond (EUR 1.5B)",
      indicativeWindow: "Mid October 2026 (Optimal Market Window)",
      illustrativeStructure: "EUR 750M 5-Year Fixed @ MS + 45bps / EUR 750M 10-Year Fixed @ MS + 75bps",
      keyTerms: [
        "Use of Proceeds: Exclusively for SAF fleet conversion and hydrogen propulsion research facilities",
        "ESG Covenant: Penalty step-up of 25bps if sustainable aviation fuel usage targets of 15% are not achieved by 2029",
        "Listing: Luxembourg Stock Exchange (LuxSE) Green exchange"
      ],
      recommendedTeams: ["DCM Industrials", "ESG Capital Markets Group", "Paris Coverage Team"],
      recommendedNextAction: "Transmit draft ESG Framework and schedule call with Airbus Treasury Lead (M. Dubois) on Thursday morning"
    },
    scoreBreakdown: {
      relationshipIntelligence: {
        score: 92,
        contribution: 25,
        confidence: 95,
        evidence: "Bank acted as Joint Bookrunner on EUR 1.0B Senior Unsecured bond in 2024. Active coverage dialogue ongoing.",
        reasoning: "The lead coverage banker maintains excellent relationships with the Group CFO and Head of Treasury."
      },
      creditSignals: {
        score: 95,
        contribution: 15,
        confidence: 98,
        evidence: "Net Debt/EBITDA of 1.4x, interest coverage of 12.5x. Ratings recently affirmed by S&P (A) and Moody's (A2).",
        reasoning: "Strong balance sheet metrics minimize default risk, placing the issuer in prime credit demand category."
      },
      marketSignals: {
        score: 91,
        contribution: 15,
        confidence: 90,
        evidence: "Credit spreads for European Aerospace are at tightest levels since 2021. Oversubscription ratio for similar credits is 3.8x.",
        reasoning: "Investor demand for high-quality industrial paper is highly elevated, creating an opportunistic issuance window."
      },
      financialHealth: {
        score: 89,
        contribution: 15,
        confidence: 95,
        evidence: "Free cash flow generated in 2025 exceeded expectations by 8%. Cash reserves of EUR 14.2B.",
        reasoning: "Healthy fundamentals but ongoing capital program of EUR 4.5B requires long-term capital structural lock-in."
      },
      historicalSimilarity: {
        score: 96,
        contribution: 10,
        confidence: 85,
        evidence: "92% match with previous deal profiles where top-tier EU industrials raised transition capital ahead of heavy capex years.",
        reasoning: "Pattern matching suggests a high probability of market entry 6 to 9 months before major production facility expansion."
      },
      newsIntelligence: {
        score: 98,
        contribution: 10,
        confidence: 92,
        evidence: "14 articles in financial press over past 10 days outlining Airbus's accelerated green transition plans.",
        reasoning: "Media and corporate narrative strongly point to public announcements regarding ESG commitment, perfectly aligned with green debt."
      },
      macroSignals: {
        score: 90,
        contribution: 10,
        confidence: 90,
        evidence: "ECB indicates likely rate pause or 25bps cut in early Q4, historical sweet spot for lock-in corporate issuance.",
        reasoning: "Macro conditions suggest issuing ahead of any potential US presidential election or winter energy price volatility."
      }
    }
  },
  {
    id: "siemens",
    name: "Siemens AG",
    sector: "Industrial Conglomerate",
    country: "Germany",
    ticker: "SIE GR",
    rating: "A1 / AA- Stable",
    opportunityScore: 88,
    trend: "stable",
    suggestedProduct: "Digital Infrastructure Bond (EUR 1.2B)",
    indicativeWindow: "Q1 2027",
    nextAction: "Deliver Digital Grid Financing Proposal",
    assignedBanker: "Marcus Vogl (Industrial Automation Coverage)",
    priority: "HIGH",
    fundingNeed: 1200,
    marketFeasibility: 92,
    dataConfidence: 88,
    relationshipReadiness: 90,
    lastUpdated: "2026-07-20T07:40:00Z",
    debtToEbitda: 1.8,
    ebitdaInterestCoverage: 10.8,
    liquidityPosition: "Excellent (EUR 11.5B cash)",
    refinancingDue: "EUR 1.5B maturing January 2027",
    marketCap: "148.6B EUR",
    aiDrivers: [
      "EUR 1.5B debt maturity scheduled for Q1 2027 requiring proactive refinancing",
      "Siemens Digital Industries division targeting software acquisitions in industrial IoT space",
      "Very strong institutional ESG score, eligible for ESG-targeted funds"
    ],
    positiveSignals: [
      "Credit spreads for German blue-chips are extremely thin",
      "Robust Q3 earnings surprise (+11% on industrial automation margins)",
      "High similarity to successful Schneider Electric sustainability-linked issue"
    ],
    supportingEvidence: [
      "Acquisition of digital grid asset in the US valued at EUR 850M requires debt replacement",
      "German sovereign bond yield premium has stabilized, reducing volatility in swap rates"
    ],
    counterSignals: [
      "Strong operational cash flows may lead to self-funding the acquisition",
      "Stricter governance rules on tech-heavy spin-offs could delay board sign-off"
    ],
    missingData: [
      "precise amortization schedule of industrial JV debt is unavailable"
    ],
    risks: [
      "Macro slowdown in China automation demand could depress investor sentiment",
      "Inflationary pressure on German engineering labor contracts"
    ],
    recommendation: {
      suggestedProduct: "Sustainability-Linked Bond (SLB) (EUR 1.2B)",
      indicativeWindow: "January 2027 (Pre-refinancing Window)",
      illustrativeStructure: "EUR 600M 7-Year SLB / EUR 600M 12-Year SLB",
      keyTerms: [
        "KPI: 20% reduction in Scope 1 & 2 carbon footprint across global software campuses by 2028",
        "Step-up: 25bps if carbon target is verified as missed by third-party auditor",
        "Lead Manager: Our bank to act as joint physical bookrunner"
      ],
      recommendedTeams: ["DCM Corporates Germany", "ESG Structuring Team", "Frankfurt Corporate Coverage"],
      recommendedNextAction: "Submit formal RFQ response and invite Head of Corporate Finance for brief workshop on European ESG investor landscape"
    },
    scoreBreakdown: {
      relationshipIntelligence: {
        score: 95,
        contribution: 25,
        confidence: 98,
        evidence: "Core relational Tier-1 bank status. Acted as co-manager on 3 out of last 4 issuances. Coverage active.",
        reasoning: "Excellent executive access and a long history of underwriting Siemens debt."
      },
      creditSignals: {
        score: 92,
        contribution: 15,
        confidence: 96,
        evidence: "Net Debt/EBITDA 1.8x, solid ratings from Moody's (A1) and Fitch (A+). Highly stable outlook.",
        reasoning: "A pristine credit profile with massive institutional investor following across Europe."
      },
      marketSignals: {
        score: 87,
        contribution: 15,
        confidence: 90,
        evidence: "Strong demand for core Eurozone corporate debt, but heavy queue of competitors in Jan issuance window.",
        reasoning: "The deal will easily clear, but pricing needs to be fine-tuned to capture maximum investor appetite."
      },
      financialHealth: {
        score: 85,
        contribution: 15,
        confidence: 93,
        evidence: "Solid growth in industrial software revenues. High capital expenditure in R&D.",
        reasoning: "Highly sustainable cash generation, with modest leverage capacity to spare."
      },
      historicalSimilarity: {
        score: 88,
        contribution: 10,
        confidence: 82,
        evidence: "Historical models show Siemens executes debt issuance 4-5 months in advance of major maturity dates.",
        reasoning: "Maturity of EUR 1.5B in Jan 2027 triggers highly predictable capital market activity in late Autumn/Winter."
      },
      newsIntelligence: {
        score: 82,
        contribution: 10,
        confidence: 88,
        evidence: "Press releases confirm Siemens accelerating smart infrastructure division focus.",
        reasoning: "Market messaging aligns perfectly with digitalization financing themes."
      },
      macroSignals: {
        score: 84,
        contribution: 10,
        confidence: 91,
        evidence: "Bund-Swap spreads remain within narrow corridors, supporting predictable issuance cost structure.",
        reasoning: "Ideal stable conditions for large-scale corporate refinancing."
      }
    }
  },
  {
    id: "lvmh",
    name: "LVMH Moët Hennessy Louis Vuitton",
    sector: "Luxury Goods",
    country: "France",
    ticker: "MC FP",
    rating: "Aa3 / A1 Positive",
    opportunityScore: 82,
    trend: "up",
    suggestedProduct: "Convertible Bond (EUR 1.0B)",
    indicativeWindow: "Q4 2026",
    nextAction: "Deliver Structured Equity Options Memo",
    assignedBanker: "Chantal Moreau (Luxury & Retail Group)",
    priority: "HIGH",
    fundingNeed: 1000,
    marketFeasibility: 95,
    dataConfidence: 85,
    relationshipReadiness: 75,
    lastUpdated: "2026-07-20T09:00:00Z",
    debtToEbitda: 0.9,
    ebitdaInterestCoverage: 22.1,
    liquidityPosition: "Outstanding (EUR 18.0B cash)",
    refinancingDue: "None imminent (long-dated structure)",
    marketCap: "385.4B EUR",
    aiDrivers: [
      "Rumors of strategic acquisition of Swiss independent luxury watch brand (valued at EUR 2.4B)",
      "Opportunity to issue low-coupon or zero-coupon convertible debt due to highly valued equity",
      "Premium brand cachet ensures intense retail and institutional retail-facing investor bid"
    ],
    positiveSignals: [
      "Excellent equity performance (+14% over past 90 days)",
      "High equity volatility indices skew convertible pricing in favor of the issuer",
      "Unused credit facilities of EUR 12.0B provide bulletproof liquidity backstop"
    ],
    supportingEvidence: [
      "LVMH treasury issued USD debt last year at highly competitive rates, indicating appetite to expand EUR capital reserves",
      "S&P upgraded credit rating outlook to Positive from Stable"
    ],
    counterSignals: [
      "The Arnault family prefers direct cash/equity control, and may disfavor convertible structures that dilute family voting rights",
      "Absolute lack of leverage pressure implies no immediate necessity for capital raising"
    ],
    missingData: [
      "Details regarding Swiss watch brand acquisition target are strictly confidential"
    ],
    risks: [
      "Global luxury spend slowdown could negatively affect equity value post-issuance",
      "Potential adverse tax changes in France target high-cap luxury groups"
    ],
    recommendation: {
      suggestedProduct: "Zero-Coupon Senior Convertible Bond (EUR 1.0B)",
      indicativeWindow: "November 2026",
      illustrativeStructure: "EUR 1.0B 7-Year Convertible Bond / Zero-Coupon / 42% Conversion Premium",
      keyTerms: [
        "Conversion Premium: 42% over volume-weighted average price (VWAP) on pricing date",
        "Call Protection: 4-year hard no-call provision to protect investor upside",
        "Redemption: Cash-settled option to prevent immediate share dilution"
      ],
      recommendedTeams: ["Equity Linked Capital Markets (ELCM)", "France Coverage Group", "M&A Advisory Retail"],
      recommendedNextAction: "Arrange private presentation to Group CFO (Jean-Jacques Guiony) outlining benefits of synthetic zero-coupon convertible structures"
    },
    scoreBreakdown: {
      relationshipIntelligence: {
        score: 68,
        contribution: 25,
        confidence: 85,
        evidence: "Tier-2 relationship. Secondary provider on corporate facilities. Strong coverage efforts ongoing.",
        reasoning: "LVMH holds extremely tight ties to French rivals; our bank needs to present highly innovative product structures to win a mandate."
      },
      creditSignals: {
        score: 99,
        contribution: 15,
        confidence: 99,
        evidence: "Net Debt/EBITDA of 0.9x. Aa3 rating. Exceptionally strong consumer brand cash generation.",
        reasoning: "Flawless credit quality. Virtually zero risk. Extremely attractive to safety-seeking global bond investors."
      },
      marketSignals: {
        score: 89,
        contribution: 15,
        confidence: 92,
        evidence: "Equity-linked issuance volume in Europe is up 34% year-on-year. Zero-coupon structures are highly marketable.",
        reasoning: "Excellent market receptive window for high-profile luxury convertible debt."
      },
      financialHealth: {
        score: 97,
        contribution: 15,
        confidence: 98,
        evidence: "Operating margin of 26.5%, industry leading cash reserves.",
        reasoning: "The absolute gold standard of financial health, giving the company massive leverage and timing optionality."
      },
      historicalSimilarity: {
        score: 74,
        contribution: 10,
        confidence: 75,
        evidence: "LVMH historically funds M&A through cash first, senior public debt second. Low historic convertible usage.",
        reasoning: "The model scores convertible similarity lower based on historical conservative family capital structuring."
      },
      newsIntelligence: {
        score: 88,
        contribution: 10,
        confidence: 90,
        evidence: "High volume of M&A luxury market speculation in premium sector journals.",
        reasoning: "Press noise acts as a strong precursor signal for advisory and corporate financing teams."
      },
      macroSignals: {
        score: 80,
        contribution: 10,
        confidence: 88,
        evidence: "Global luxury stock recovery, low inflation indicators support premium valuation trends.",
        reasoning: "Ideal macro environment for high-cap French equities."
      }
    }
  },
  {
    id: "bp",
    name: "BP plc",
    sector: "Energy / Oil & Gas",
    country: "United Kingdom",
    ticker: "BP/ LN",
    rating: "A3 / A- Positive",
    opportunityScore: 85,
    trend: "up",
    suggestedProduct: "Green Transition Hybrid Bond (EUR 800M)",
    indicativeWindow: "Q4 2026",
    nextAction: "Deliver Energy Transition Advisory Deck",
    assignedBanker: "Alastair Sterling (Natural Resources UK)",
    priority: "MEDIUM",
    fundingNeed: 800,
    marketFeasibility: 85,
    dataConfidence: 90,
    relationshipReadiness: 82,
    lastUpdated: "2026-07-20T09:12:00Z",
    debtToEbitda: 2.1,
    ebitdaInterestCoverage: 8.4,
    liquidityPosition: "Adequate (GBP 7.8B cash)",
    refinancingDue: "GBP 1.2B equivalent maturing late 2026",
    marketCap: "94.8B EUR equivalent",
    aiDrivers: [
      "BP target of expanding offshore wind and electric vehicle (EV) charging infrastructure requiring GBP 2.5B capex by end of 2027",
      "Proactive refinancing of expiring GBP senior bonds with EUR capital markets arbitrage benefit",
      "Rising carbon credits compliance costs incentivizing dedicated sustainable financing framework"
    ],
    positiveSignals: [
      "Crude oil prices stabilized at USD 78-82 range, ensuring highly predictable underlying cash flows",
      "European hybrid corporate bonds seeing heavy demand with yield compression of 35bps this month",
      "Very active UK-EU cross-border issuance corridor"
    ],
    supportingEvidence: [
      "BP successfully divested EUR 400M in non-core onshore assets, freeing up capital to structure hybrid transition debt",
      "Strong institutional support for oil major transition frameworks by continental European ESG funds"
    ],
    counterSignals: [
      "Shareholder pressure to prioritize share buybacks over capital expenditures could reduce total net issuance",
      "Criticism from purist green funds regarding transition vs pure green bond proceeds classification"
    ],
    missingData: [
      "Exact carbon offset validation credentials of offshore grid lines are pending final third-party registration"
    ],
    risks: [
      "Commodity price shock (sharp decline in Brent crude) would immediately impair EBITDA leverage margins",
      "Regulatory policy changes under the UK energy windfall tax regime"
    ],
    recommendation: {
      suggestedProduct: "Subordinated Green Transition Hybrid Bond (EUR 800M)",
      indicativeWindow: "November 2026",
      illustrativeStructure: "EUR 800M Perpetual Subordinated Hybrid / 5.25 Year First Reset Date",
      keyTerms: [
        "Subordination: Deeply subordinated, receives 50% equity credit by rating agencies (S&P/Moody's)",
        "Coupon Reset: Fixed rate reset at year 5.25 to 5-Year Mid-Swaps + initial credit spread + 25bps step-up",
        "Proceeds: Dedicated to electrification of retail forecourts and offshore wind joint ventures in North Sea"
      ],
      recommendedTeams: ["DCM Hybrid Structuring", "Energy & Power Coverage Group", "London DCM Syndicate"],
      recommendedNextAction: "Arrange presentation with BP Treasury Team in London to discuss rating agency equity credit treatment under updated S&P hybrid criteria"
    },
    scoreBreakdown: {
      relationshipIntelligence: {
        score: 84,
        contribution: 25,
        confidence: 94,
        evidence: "Active Tier-1 lender in BP's core revolving credit facility. Joint Lead Bookrunner on previous dual-currency issue.",
        reasoning: "Excellent relationships at the deputy treasurer and execution levels."
      },
      creditSignals: {
        score: 80,
        contribution: 15,
        confidence: 95,
        evidence: "Leverage at 2.1x Net Debt/EBITDA, stabilized. Strong free cash flow. Rating affirmed at A3 with Positive Outlook.",
        reasoning: "Credit profile is improving with positive rating momentum, attracting conservative long-term pension funds."
      },
      marketSignals: {
        score: 86,
        contribution: 15,
        confidence: 91,
        evidence: "Yields for corporate hybrids are highly attractive for institutional yield-starved asset managers.",
        reasoning: "Excellent market window for investment-grade energy hybrids offering solid spreads over sovereign debt."
      },
      financialHealth: {
        score: 81,
        contribution: 15,
        confidence: 93,
        evidence: "Underlying cash flows support both dividends and green capital allocations. Debt reduction program on track.",
        reasoning: "Robust operational metrics, though commodity prices remain a structural background variable."
      },
      historicalSimilarity: {
        score: 92,
        contribution: 10,
        confidence: 88,
        evidence: "High match with structural transition timing of peers Shell and TotalEnergies, which both issued transition hybrids recently.",
        reasoning: "Sector alignment pressure encourages BP to maintain competitive transition financing credentials."
      },
      newsIntelligence: {
        score: 85,
        contribution: 10,
        confidence: 90,
        evidence: "Consistent corporate communications emphasizing green energy targets and wind infrastructure pipeline.",
        reasoning: "Public relations strategy lays strong foundation for marketing transition-themed securities."
      },
      macroSignals: {
        score: 82,
        contribution: 10,
        confidence: 87,
        evidence: "Stabilization of UK gilt yields and sterling-euro currency swaps minimizes cross-currency hedging risk.",
        reasoning: "Favorable conditions for cross-currency issuance arb."
      }
    }
  },
  {
    id: "asml",
    name: "ASML Holding NV",
    sector: "Technology / Semiconductors",
    country: "Netherlands",
    ticker: "ASML NA",
    rating: "A3 / A Stable",
    opportunityScore: 78,
    trend: "stable",
    suggestedProduct: "Capital Expansion Follow-on (EUR 1.2B)",
    indicativeWindow: "Q2 2027",
    nextAction: "Pitch Equity Financing Options",
    assignedBanker: "Sven de Jong (Tech Investment Banking)",
    priority: "MEDIUM",
    fundingNeed: 1200,
    marketFeasibility: 90,
    dataConfidence: 85,
    relationshipReadiness: 80,
    lastUpdated: "2026-07-20T06:55:00Z",
    debtToEbitda: 0.8,
    ebitdaInterestCoverage: 18.2,
    liquidityPosition: "Excellent (EUR 6.5B cash)",
    refinancingDue: "None imminent",
    marketCap: "295.4B EUR",
    aiDrivers: [
      "Substantial capital investments in high-NA EUV lithography tool manufacturing facilities globally",
      "Very low leverage allows debt or convertible structures to be implemented with ease",
      "High global geopolitical strategic importance supporting expansion grants and co-investments"
    ],
    positiveSignals: [
      "Backlog of lithography systems remains at near-record levels (EUR 32B)",
      "High equity valuation metrics provide highly non-dilutive equity-linked financing options",
      "Unrivaled technology monopoly positioning"
    ],
    supportingEvidence: [
      "Dutch state-backed investment grants for Veldhoven expansion",
      "Strong structural semiconductor trends driven by global AI datacenter buildout"
    ],
    counterSignals: [
      "Export restrictions on advanced lithography machinery may cap terminal revenue forecasts",
      "ASML typically generates ample cash to self-finance expansion plans, avoiding public debt"
    ],
    missingData: [
      "Detailed breakdown of capital expenditure allocation for Taiwanese tech centers is highly restricted"
    ],
    risks: [
      "Geopolitical escalation in East Asia directly impacts key client base (TSMC)",
      "Highly concentrated client portfolio (TSMC, Samsung, Intel)"
    ],
    recommendation: {
      suggestedProduct: "Sustainability-Linked Convertible Bond (EUR 1.2B)",
      indicativeWindow: "April 2027",
      illustrativeStructure: "EUR 1.2B 7-Year SLB Convertible / 45% Conversion Premium / 0.50% Coupon",
      keyTerms: [
        "KPI: Increase percentage of green-certified recycled steel in machine frameworks to 40% by 2029",
        "Option: Fully convertible into ASML ordinary shares",
        "Pricing: Issued at par, zero-coupon option under evaluation depending on interest rate levels"
      ],
      recommendedTeams: ["Equity Linked Capital Markets (ELCM)", "Global Tech Investment Banking", "Benelux Corporate Coverage"],
      recommendedNextAction: "Transmit structured analysis comparing low-coupon equity-linked vs traditional investment grade senior debt to ASML Treasury"
    },
    scoreBreakdown: {
      relationshipIntelligence: {
        score: 78,
        contribution: 25,
        confidence: 90,
        evidence: "Lender on bilateral lines. Previous active advisory on logistics acquisitions. Strong relationship with tech treasury.",
        reasoning: "Solid coverage but facing intense competition from US investment banking rivals."
      },
      creditSignals: {
        score: 96,
        contribution: 15,
        confidence: 97,
        evidence: "Leverage at a tiny 0.8x Net Debt/EBITDA. AA equivalent underlying metrics. Extreme cash generation.",
        reasoning: "Flawless credit fundamentals, highly desired asset for global tech investors."
      },
      marketSignals: {
        score: 82,
        contribution: 15,
        confidence: 88,
        evidence: "European tech index performance is robust. Global tech convertibles are heavily oversubscribed (average 4.5x).",
        reasoning: "Excellent market reception guaranteed, particularly for structured ESG or sustainable tech frameworks."
      },
      financialHealth: {
        score: 95,
        contribution: 15,
        confidence: 95,
        evidence: "Monopolistic pricing power supports 51% gross margins. Overwhelming order book visibility.",
        reasoning: "Superb operational metrics, cash reserves are more than sufficient to cover immediate liabilities."
      },
      historicalSimilarity: {
        score: 65,
        contribution: 10,
        confidence: 80,
        evidence: "Historically low public debt issuer, relies primarily on corporate cash and revolving credit.",
        reasoning: "Pattern matching alerts that ASML is a selective capital markets participant, reducing raw likelihood."
      },
      newsIntelligence: {
        score: 80,
        contribution: 10,
        confidence: 85,
        evidence: "Frequent technical press articles regarding high-NA EUV rollout and global chip factory expansions.",
        reasoning: "High news frequency drives capital intensity focus, supporting expansion financing thesis."
      },
      macroSignals: {
        score: 75,
        contribution: 10,
        confidence: 89,
        evidence: "US and European policy initiatives (Chips Acts) supply substantial co-financing backing.",
        reasoning: "Macro policy environment favors domestic semiconductor manufacturing investments."
      }
    }
  }
];

// Graph Nodes & Links for the Interactive Knowledge Graph
export const GRAPH_NODES: GraphNode[] = [
  // Issuers
  { id: "node-airbus", label: "Airbus SE", type: "issuer", group: "Aerospace" },
  { id: "node-siemens", label: "Siemens AG", type: "issuer", group: "Industrials" },
  { id: "node-lvmh", label: "LVMH Group", type: "issuer", group: "Luxury" },
  { id: "node-bp", label: "BP plc", type: "issuer", group: "Energy" },
  { id: "node-asml", label: "ASML Holding", type: "issuer", group: "Technology" },
  
  // Coverage Bankers
  { id: "node-jp-laurent", label: "Jean-Pierre Laurent (MD)", type: "banker" },
  { id: "node-m-vogl", label: "Marcus Vogl (MD)", type: "banker" },
  { id: "node-c-moreau", label: "Chantal Moreau (MD)", type: "banker" },
  { id: "node-a-sterling", label: "Alastair Sterling (MD)", type: "banker" },
  { id: "node-s-jong", label: "Sven de Jong (MD)", type: "banker" },
  
  // Previous Deals
  { id: "node-deal-air24", label: "Airbus EUR 1.0B Senior Bond (2024)", type: "deal" },
  { id: "node-deal-sie23", label: "Siemens EUR 1.5B Bond (2023)", type: "deal" },
  { id: "node-deal-bp25", label: "BP GBP 1.2B Dual-Tranche (2025)", type: "deal" },
  
  // Investors (Major Buyers)
  { id: "node-inv-amundi", label: "Amundi Asset Mgmt", type: "investor" },
  { id: "node-inv-blackrock", label: "BlackRock Europe", type: "investor" },
  { id: "node-inv-allianz", label: "Allianz Global Investors", type: "investor" },
  
  // Peers
  { id: "node-peer-safran", label: "Safran SE", type: "peer" },
  { id: "node-peer-schneider", label: "Schneider Electric", type: "peer" },
  { id: "node-peer-kering", label: "Kering SA", type: "peer" },
  { id: "node-peer-shell", label: "Shell plc", type: "peer" },
  { id: "node-peer-tsmc", label: "TSMC Europe", type: "peer" },
  
  // Sectors & Ratings
  { id: "node-rating-a2", label: "A2 / S&P A Rating", type: "rating" },
  { id: "node-sector-green", label: "ESG & Green Finance", type: "event" }
];

export const GRAPH_LINKS: GraphLink[] = [
  // Bankers Coverage
  { source: "node-jp-laurent", target: "node-airbus", label: "Lead Coverage" },
  { source: "node-m-vogl", target: "node-siemens", label: "Lead Coverage" },
  { source: "node-c-moreau", target: "node-lvmh", label: "Lead Coverage" },
  { source: "node-a-sterling", target: "node-bp", label: "Lead Coverage" },
  { source: "node-s-jong", target: "node-asml", label: "Lead Coverage" },
  
  // Deal Underwritings
  { source: "node-airbus", target: "node-deal-air24", label: "Issued" },
  { source: "node-siemens", target: "node-deal-sie23", label: "Issued" },
  { source: "node-bp", target: "node-deal-bp25", label: "Issued" },
  
  // Joint Bookrunners (Bank's involvement)
  { source: "node-jp-laurent", target: "node-deal-air24", label: "Sole Bookrunner" },
  { source: "node-m-vogl", target: "node-deal-sie23", label: "Joint Bookrunner" },
  { source: "node-a-sterling", target: "node-deal-bp25", label: "Joint Bookrunner" },
  
  // Investors purchases
  { source: "node-inv-amundi", target: "node-deal-air24", label: "Purchased EUR 150M" },
  { source: "node-inv-blackrock", target: "node-deal-sie23", label: "Purchased EUR 250M" },
  { source: "node-inv-allianz", target: "node-deal-bp25", label: "Purchased GBP 180M" },
  
  // Peer relationships
  { source: "node-airbus", target: "node-peer-safran", label: "Supplier Peer" },
  { source: "node-siemens", target: "node-peer-schneider", label: "Direct Sector Peer" },
  { source: "node-lvmh", target: "node-peer-kering", label: "Luxury Sector Peer" },
  { source: "node-bp", target: "node-peer-shell", label: "Direct Sector Peer" },
  { source: "node-asml", target: "node-peer-tsmc", label: "Strategic Client Peer" },
  
  // Ratings
  { source: "node-airbus", target: "node-rating-a2", label: "Rated" },
  { source: "node-siemens", target: "node-rating-a2", label: "Rated A1 (Peer)" },
  
  // ESG connection
  { source: "node-airbus", target: "node-sector-green", label: "Active ESG Program" },
  { source: "node-siemens", target: "node-sector-green", label: "Active ESG Program" },
  { source: "node-bp", target: "node-sector-green", label: "Energy Transition Mandate" }
];

// Market Monitoring Indicators
export const MARKET_INDICATORS: MarketIndicator[] = [
  {
    id: "ecb-rate",
    name: "ECB Main Refinancing Rate",
    value: "3.75%",
    change: "0.00%",
    trend: "stable",
    influence: "Determines Euro benchmark swap base rates. Stabilization supports tight pricing on EUR high-grade corporate bonds."
  },
  {
    id: "de-10y",
    name: "German 10Y Bund Yield",
    value: "2.34%",
    change: "-0.04%",
    trend: "down",
    influence: "The ultimate risk-free rate for Eurozone bonds. Decreasing yields reduce overall cost of debt for European issuers."
  },
  {
    id: "it-10y",
    name: "Italy 10Y BTP Yield",
    value: "3.68%",
    change: "-0.08%",
    trend: "down",
    influence: "Benchmarks Southern European credit risk. Spread compression versus Bunds triggers Italian corporate capital access."
  },
  {
    id: "eur-ig-spreads",
    name: "Markit iTraxx Europe IG (Spreads)",
    value: "54.2 bps",
    change: "-1.8 bps",
    trend: "down",
    influence: "Measures investment grade corporate credit default swap pricing. Thin spreads signal heavy market receptive window."
  },
  {
    id: "eur-hy-spreads",
    name: "Markit iTraxx Europe Crossover (HY)",
    value: "282.5 bps",
    change: "-6.5 bps",
    trend: "down",
    influence: "Measures European high yield risk premium. Favorable downward trajectory re-opens acquisition finance corridors."
  },
  {
    id: "dax",
    name: "DAX Index (Frankfurt)",
    value: "18,420.5",
    change: "+0.45%",
    trend: "up",
    influence: "Reflects German industrial and tech valuation health. Strong indices support convertible bond conversion terms."
  },
  {
    id: "cac",
    name: "CAC 40 Index (Paris)",
    value: "7,615.2",
    change: "+0.12%",
    trend: "up",
    influence: "Reflects French luxury and large-cap industrial equity. Strong pricing drives structured convertible structures."
  },
  {
    id: "v2x",
    name: "Euro Stoxx 50 Volatility (V2X)",
    value: "14.12",
    change: "-0.32",
    trend: "down",
    influence: "Eurozone equity volatility indicator. Low volatility (below 16) opens broad windows for primary IPO and follow-on offerings."
  },
  {
    id: "eur-usd",
    name: "EUR / USD",
    value: "1.0912",
    change: "-0.0015",
    trend: "stable",
    influence: "Dictates cross-border DCM issuance swaps. A stable Euro rate prevents currency hedging cost spikes for US cross-border issuance."
  },
  {
    id: "ipo-window",
    name: "AI Equity Market Window",
    value: "OPEN (88/100)",
    change: "+4",
    trend: "up",
    influence: "Proprietary SIG score tracking macroeconomic variables and volatility. High score suggests immediate equity marketing launch."
  },
  {
    id: "bond-window",
    name: "AI Bond Market Window",
    value: "PRIMED (94/100)",
    change: "+2",
    trend: "up",
    influence: "Aggregated credit metrics indicating optimal conditions for high-grade EUR issuances due to strong capital inflows."
  }
];

// Market AI Summary
export const MARKET_AI_SUMMARY = 
  "Primary European credit markets are enjoying a period of exceptional receptivity. S&P/Moody's corporate ratings upgrades have outpaced downgrades for 3 consecutive weeks, while investor demand for sustainable and green paper is near an all-time high, driven by heavy ESG fund inflows. Sovereign yield curves in Germany and France are stabilizing, compressing swap spreads and offering issuers highly predictable refinancing environments. Equity volatility (V2X) remains low at 14.1, indicating that both the convertible and follow-on equity windows are wide open for high-profile issuers like LVMH and ASML. Strategic advisory teams should advise corporate clients to front-load issuance before potential late-autumn macro events or rate path volatility.";

// Alerts data
export const ALERTS: Alert[] = [
  {
    id: "alert-1",
    issuerId: "airbus",
    issuerName: "Airbus SE",
    type: "MARKET_WINDOW",
    title: "Euro IG Spreads Compress to 3-Year Tight",
    message: "iTraxx Europe IG tightened below 55bps, triggering the primary pricing threshold for Large-Cap Industrials.",
    urgency: "CRITICAL",
    timestamp: "2026-07-20T08:00:00Z",
    whyItMatters: "Airbus's indicative pricing of MS + 45bps on a 5-Year Green Bond is now 8bps lower than last month, saving approximately EUR 6.0M in lifetime interest expense.",
    aiReasoning: "Heavy liquidity inflows into high-grade European fixed income mutual funds have compressed the corporate spread premium. High likelihood of immediate competitive bond supply queue forming.",
    suggestedAction: "Coverage banker Jean-Pierre Laurent should instantly dispatch the finalized 'Green Bond Pricing Update' document to the Airbus head of treasury."
  },
  {
    id: "alert-2",
    issuerId: "siemens",
    issuerName: "Siemens AG",
    type: "DEBT_MATURITY",
    title: "EUR 1.5B 2.25% Senior Notes Approaching 6-Month Maturity",
    message: "Siemens's core senior debt series (ISIN: XS129384812) expires on January 15, 2027.",
    urgency: "HIGH",
    timestamp: "2026-07-20T07:15:00Z",
    whyItMatters: "A proactive 4-6 month lead time is the standard refinancing corridor for AA- rated issuers to secure investor commitments and manage asset-liability balance sheet ratios.",
    aiReasoning: "SIG's predictive engine identifies this maturity as the #1 mechanical driver of Siemens's capital market entry probability (94% historical correlation with pre-refinancing issues).",
    suggestedAction: "DCM Corporates Germany should deliver the structured grid-financing refi proposal this week."
  },
  {
    id: "alert-3",
    issuerId: "lvmh",
    issuerName: "LVMH Group",
    type: "ACQUISITION",
    title: "M&A Intelligence Flags Swiss Watch Target Speculation",
    message: "Proprietary text mining of Swiss registry filings reveals corporate restructure at target independent watch manufacture.",
    urgency: "HIGH",
    timestamp: "2026-07-19T17:30:00Z",
    whyItMatters: "If LVMH proceeds with this EUR 2.4B acquisition, it will require external funding to bridge cash reserves. Structured convertible debt is the optimal non-dilutive solution.",
    aiReasoning: "Similar strategic luxury integrations (e.g. Tiffany acquisition) utilized dual-tranche bridging facilities followed by senior debt refinancing. High likelihood of advisory and capital markets mandate.",
    suggestedAction: "Chantal Moreau should coordinate with the Swiss advisory desk to secure a bilateral M&A overview meeting."
  },
  {
    id: "alert-4",
    issuerId: "bp",
    issuerName: "BP plc",
    type: "RATING_UPGRADE",
    title: "S&P Revises BP Outlook to Positive",
    message: "Standard & Poor's affirmed A- rating and revised outlook to Positive from Stable on improving leverage indicators.",
    urgency: "MEDIUM",
    timestamp: "2026-07-18T10:00:00Z",
    whyItMatters: "Upgraded outlook reduces hybrid subordination rating penalties from BB+ to BBB-, opening the hybrid issue to strict investment grade mandates.",
    aiReasoning: "An upgrade to flat A rating is likely within 9 months if Net Debt/EBITDA is held below 2.2x. Hybrid coupon pricing spreads would tighten by an estimated 25-30bps upon upgrade.",
    suggestedAction: "Alastair Sterling should update the illustrative term sheet in the transition hybrid pitch deck."
  }
];

// My Actions work queue
export const MY_ACTIONS: MyAction[] = [
  {
    id: "action-1",
    issuerId: "airbus",
    issuerName: "Airbus SE",
    type: "Assigned Review",
    title: "Review Airbus Opportunity Flag",
    description: "Validate the AI drivers, positive signals, and score contribution metrics for the EUR 1.5B Green Bond proposal.",
    dueDate: "2026-07-21",
    status: "PENDING",
    owner: "Jean-Pierre Laurent"
  },
  {
    id: "action-2",
    issuerId: "siemens",
    issuerName: "Siemens AG",
    type: "Prepare Pitch",
    title: "Draft Digital Infrastructure Bond Deck",
    description: "Develop the illustrative sustainability-linked coupon penalty structure and key ESG metrics slides.",
    dueDate: "2026-07-23",
    status: "IN_PROGRESS",
    owner: "Marcus Vogl"
  },
  {
    id: "action-3",
    issuerId: "lvmh",
    issuerName: "LVMH Group",
    type: "Generate Brief",
    title: "Equity-Linked Dilution Assessment",
    description: "Run quantitative simulation of cash-settled zero-coupon convertibles at 42% premium to demonstrate zero immediate family voting dilution.",
    dueDate: "2026-07-24",
    status: "PENDING",
    owner: "Chantal Moreau"
  },
  {
    id: "action-4",
    issuerId: "bp",
    issuerName: "BP plc",
    type: "Upcoming Meeting",
    title: "BP Treasury Advisory Webex",
    description: "Brief Deputy Treasurer (Sarah Jenkins) on the latest S&P Hybrid equity-credit guidelines and pricing levels.",
    dueDate: "2026-07-22",
    status: "IN_PROGRESS",
    owner: "Alastair Sterling"
  },
  {
    id: "action-5",
    issuerId: "asml",
    issuerName: "ASML Holding",
    type: "Contact Client",
    title: "ASML Semiconductor Capex Call",
    description: "Check in with ASML Treasury on Veldhoven expansion funding timeline and bilateral bank credit allocations.",
    dueDate: "2026-07-20",
    status: "COMPLETED",
    owner: "Sven de Jong"
  }
];
