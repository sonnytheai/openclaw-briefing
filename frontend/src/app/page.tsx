import { getRecentBriefings } from "@/lib/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

function urgencyDot(urgency: string) {
  const colors: Record<string, string> = {
    critical: "text-red-500 animate-pulse",
    high: "text-orange-500",
    medium: "text-blue-400",
    low: "text-[var(--text-muted)]",
  };
  return <span className={`${colors[urgency] || colors.low} text-sm`}>●</span>;
}

function sentimentLabel(sentiment: string) {
  const colors: Record<string, string> = {
    positive: "text-green-500",
    negative: "text-red-500",
    mixed: "text-yellow-500",
    neutral: "text-[var(--text-muted)]",
  };
  return (
    <span className={`${colors[sentiment] || colors.neutral} text-[10px] uppercase font-bold`}>
      {sentiment?.slice(0, 3).toUpperCase() || "NEU"}
    </span>
  );
}

export default async function Home() {
  const recentBriefings = getRecentBriefings();

  if (!recentBriefings.length) {
    return (
      <div className="text-center py-20 text-[var(--text-muted)] tracking-widest text-xs font-mono">
        NO DATA AVAILABLE — Run your first briefing job to get started.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {recentBriefings.map((day) => (
        <div key={day.date}>
          <div className="border-l-[3px] border-[var(--accent-primary)] bg-[var(--bg-header)] px-2 py-1 flex justify-between items-center">
            <h2 className="text-[var(--text-bright)] font-bold tracking-widest uppercase text-xs">
              {day.date}
            </h2>
            <span className="text-[var(--text-muted)] text-[10px]">
              {day.briefings.length} ENTRIES
            </span>
          </div>
          <div className="border-t border-[var(--border)]">
            {day.briefings.map((s) => (
              <Link
                key={s.id}
                href={`/briefing/${s.date}/${s.analysisType}`}
                className="group block border-b border-[var(--border)] py-2 px-2 hover:bg-[var(--bg-hover)]"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-[var(--accent-blue)] font-bold text-[10px] uppercase w-[50px] shrink-0">
                    {s.analysisType.slice(0, 4).toUpperCase()}
                  </span>
                  {urgencyDot(s.urgency)}
                  <span className="font-bold text-sm truncate group-hover:text-[var(--text-bright)]">
                    {s.headline}
                  </span>
                  <span className="ml-auto flex items-center gap-3 text-[10px] text-[var(--text-muted)] shrink-0">
                    {sentimentLabel(s.sentiment)}
                    <span>{s.sourceCount}src/{s.itemCount}itm</span>
                  </span>
                </div>
                <div className="mt-1 pl-[80px] space-y-0.5">
                  {s.keyPoints.slice(0, 2).map((p, i) => (
                    <div key={i} className="text-[11px] text-[var(--text-muted)] flex">
                      <span className="mr-1.5 text-[var(--accent-primary)] shrink-0">&gt;</span>
                      <span className="truncate">{p}</span>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
