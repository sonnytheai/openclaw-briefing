import { getBriefingsByDate, getAvailableDates } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const summaries = getBriefingsByDate(date);

  if (!summaries.length) notFound();

  const allDates = getAvailableDates();
  const idx = allDates.indexOf(date);
  const prevDate = idx < allDates.length - 1 ? allDates[idx + 1] : null;
  const nextDate = idx > 0 ? allDates[idx - 1] : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-wider">
        <Link href="/" className="hover:text-[var(--text-primary)]">HOME</Link>
        <span>&gt;</span>
        <span className="text-[var(--text-bright)]">{date}</span>
      </div>

      <div className="border-b border-[var(--border)] pb-2 flex justify-between items-center">
        {prevDate ? (
          <Link href={`/briefing/${prevDate}`} className="text-[var(--accent-blue)] text-xs hover:underline">&lt; {prevDate}</Link>
        ) : <span />}
        <h1 className="text-lg font-bold tracking-wider">{date}</h1>
        {nextDate ? (
          <Link href={`/briefing/${nextDate}`} className="text-[var(--accent-blue)] text-xs hover:underline">{nextDate} &gt;</Link>
        ) : <span />}
      </div>

      <div className="border-t border-[var(--border)]">
        {summaries.map((s) => (
          <Link
            key={s.id}
            href={`/briefing/${date}/${s.analysisType}`}
            className="block border-b border-[var(--border)] py-2 px-2 hover:bg-[var(--bg-hover)]"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-[var(--accent-blue)] font-bold text-[10px] uppercase w-[50px]">
                {s.analysisType.slice(0, 4).toUpperCase()}
              </span>
              <span className="font-bold text-sm truncate">{s.headline}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
