import { getBriefing } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import BriefingItemAccordion from "./BriefingItemAccordion";

export const dynamic = "force-dynamic";

export default async function BriefingDetailPage({ params }: { params: Promise<{ date: string; type: string }> }) {
  const { date, type } = await params;
  const briefing = getBriefing(date, type);

  if (!briefing) notFound();

  const { summary, items, meta } = briefing;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-wider">
        <Link href="/" className="hover:text-[var(--text-primary)]">HOME</Link>
        <span>&gt;</span>
        <Link href={`/briefing/${date}`} className="hover:text-[var(--text-primary)]">{date}</Link>
        <span>&gt;</span>
        <span className="text-[var(--text-bright)] font-bold">{type}</span>
      </div>

      <div className="border-l-[3px] border-[var(--accent-primary)] bg-[var(--bg-header)] px-3 py-1">
        <h2 className="text-[var(--text-bright)] font-bold tracking-widest uppercase text-xs">BRIEFING</h2>
      </div>

      <div className="px-1">
        <h1 className="text-xl font-bold text-[var(--text-bright)] mb-4 leading-tight">
          {summary.headline}
        </h1>

        <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] border-t border-b border-[var(--border)] py-2 mb-4">
          <span>URGENCY: <strong className="text-[var(--text-bright)]">{summary.urgency.toUpperCase()}</strong></span>
          <span>SENTIMENT: <strong className="text-[var(--text-bright)]">{summary.sentiment.toUpperCase()}</strong></span>
          <span><strong className="text-[var(--text-bright)]">{meta.sourceCount}</strong> SOURCES</span>
          <span><strong className="text-[var(--text-bright)]">{meta.itemCount}</strong> ITEMS</span>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        {items.map((item) => (
          <BriefingItemAccordion key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
