// ── Database Row Types (matching SQLite schema) ────────────────────────

export interface BriefingRow {
  id: number;
  job_name: string;
  date: string;
  analysis_type: string;
  headline: string | null;
  sentiment: string | null;
  urgency: string | null;
  key_points: string | null;
  source_count: number | null;
  item_count: number | null;
  created_at: string | null;
}

export interface BriefingItemRow {
  id: number;
  briefing_id: number;
  item_order: number;
  headline: string;
  source_type: string | null;
  source_name: string | null;
  source_url: string | null;
  source_timestamp: string | null;
  what_happened: string | null;
  background_historical: string | null;
  background_cultural: string | null;
  background_causation: string | null;
  timeline: string | null;
  positions: string | null;
  outlook: string | null;
  impact_direct: string | null;
  impact_indirect: string | null;
  impact_watch_points: string | null;
  references_json: string | null;
  tags: string | null;
  created_at: string | null;
}

// ── Parsed Application Types ───────────────────────────────────────────

export type AnalysisType = string; // e.g. "politics", "economy", "technology"
export type Sentiment = "positive" | "negative" | "neutral" | "mixed";
export type Urgency = "low" | "medium" | "high" | "critical";

export interface Briefing {
  meta: {
    id: number;
    job: string;
    date: string;
    analysisType: string;
    sourceCount: number;
    itemCount: number;
    createdAt: string;
  };
  summary: {
    headline: string;
    keyPoints: string[];
    sentiment: Sentiment;
    urgency: Urgency;
  };
  items: BriefingItem[];
}

export interface BriefingItem {
  id: number;
  order: number;
  headline: string;
  source: {
    type: "twitter" | "rss";
    name: string;
    url: string;
    timestamp: string;
  };
  analysis: {
    whatHappened: string;
    background: {
      historical: string;
      culturalReligious?: string;
      causation: string;
      timeline?: TimelineEntry[];
    };
    positions: Position[];
    outlook: {
      scenarios: Scenario[];
      expertOpinions?: string[];
    };
    impact: {
      direct: string;
      indirect: string;
      watchPoints: string[];
    };
  };
  references: Reference[];
  tags: string[];
}

export interface TimelineEntry {
  date: string;
  event: string;
}

export interface Position {
  side?: string;
  actor?: string;
  stance: string;
  coreArgument?: string;
  hiddenInterest?: string;
}

export interface Scenario {
  name?: string;
  label?: string;
  description: string;
  probability?: string;
}

export interface Reference {
  url: string;
  title: string;
}

// ── View Types ─────────────────────────────────────────────────────────

export interface BriefingSummary {
  id: number;
  date: string;
  analysisType: string;
  headline: string;
  sentiment: Sentiment;
  urgency: Urgency;
  keyPoints: string[];
  sourceCount: number;
  itemCount: number;
}

export interface DayBriefings {
  date: string;
  briefings: BriefingSummary[];
}
