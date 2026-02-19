import { getDb } from "./db";
import type {
  BriefingRow,
  BriefingItemRow,
  Briefing,
  BriefingItem,
  BriefingSummary,
  DayBriefings,
  Sentiment,
  Urgency,
  TimelineEntry,
  Position,
  Scenario,
  Reference,
} from "./types";

function parseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toBriefingSummary(row: BriefingRow): BriefingSummary {
  return {
    id: row.id,
    date: row.date,
    analysisType: row.analysis_type,
    headline: row.headline ?? "",
    sentiment: (row.sentiment as Sentiment) ?? "neutral",
    urgency: (row.urgency as Urgency) ?? "low",
    keyPoints: parseJSON<string[]>(row.key_points, []),
    sourceCount: row.source_count ?? 0,
    itemCount: row.item_count ?? 0,
  };
}

function toBriefingItem(row: BriefingItemRow): BriefingItem {
  const outlook = parseJSON<{
    scenarios?: Scenario[];
    expertOpinions?: string[];
  }>(row.outlook, {});

  return {
    id: row.id,
    order: row.item_order,
    headline: row.headline,
    source: {
      type: (row.source_type as "twitter" | "rss") ?? "rss",
      name: row.source_name ?? "Unknown",
      url: row.source_url ?? "",
      timestamp: row.source_timestamp ?? "",
    },
    analysis: {
      whatHappened: row.what_happened ?? "",
      background: {
        historical: row.background_historical ?? "",
        culturalReligious: row.background_cultural ?? undefined,
        causation: row.background_causation ?? "",
        timeline: parseJSON<TimelineEntry[] | undefined>(row.timeline, undefined),
      },
      positions: parseJSON<Position[]>(row.positions, []),
      outlook: {
        scenarios: outlook.scenarios ?? [],
        expertOpinions: outlook.expertOpinions ?? undefined,
      },
      impact: {
        direct: row.impact_direct ?? "",
        indirect: row.impact_indirect ?? "",
        watchPoints: parseJSON<string[]>(row.impact_watch_points, []),
      },
    },
    references: parseJSON<Reference[]>(row.references_json, []),
    tags: parseJSON<string[]>(row.tags, []),
  };
}

/** Get recent briefing summaries grouped by date */
export function getRecentBriefings(limit = 30): DayBriefings[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM briefings ORDER BY date DESC, analysis_type ASC LIMIT ?`)
    .all(limit) as BriefingRow[];

  const grouped = new Map<string, BriefingSummary[]>();
  for (const row of rows) {
    const summary = toBriefingSummary(row);
    const existing = grouped.get(row.date);
    if (existing) existing.push(summary);
    else grouped.set(row.date, [summary]);
  }

  return Array.from(grouped.entries()).map(([date, briefings]) => ({
    date,
    briefings,
  }));
}

/** Get all briefings for a specific date */
export function getBriefingsByDate(date: string): BriefingSummary[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM briefings WHERE date = ? ORDER BY analysis_type ASC`)
    .all(date) as BriefingRow[];
  return rows.map(toBriefingSummary);
}

/** Get a full briefing with all items */
export function getBriefing(date: string, analysisType: string): Briefing | null {
  const db = getDb();
  const briefingRow = db
    .prepare(`SELECT * FROM briefings WHERE date = ? AND analysis_type = ?`)
    .get(date, analysisType) as BriefingRow | undefined;

  if (!briefingRow) return null;

  const itemRows = db
    .prepare(`SELECT * FROM briefing_items WHERE briefing_id = ? ORDER BY item_order ASC`)
    .all(briefingRow.id) as BriefingItemRow[];

  return {
    meta: {
      id: briefingRow.id,
      job: briefingRow.job_name,
      date: briefingRow.date,
      analysisType: briefingRow.analysis_type,
      sourceCount: briefingRow.source_count ?? 0,
      itemCount: briefingRow.item_count ?? 0,
      createdAt: briefingRow.created_at ?? "",
    },
    summary: {
      headline: briefingRow.headline ?? "",
      keyPoints: parseJSON<string[]>(briefingRow.key_points, []),
      sentiment: (briefingRow.sentiment as Sentiment) ?? "neutral",
      urgency: (briefingRow.urgency as Urgency) ?? "low",
    },
    items: itemRows.map(toBriefingItem),
  };
}

/** Get all available dates */
export function getAvailableDates(): string[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT DISTINCT date FROM briefings ORDER BY date DESC`)
    .all() as { date: string }[];
  return rows.map((r) => r.date);
}
