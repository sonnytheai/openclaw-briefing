"use client";

import { useState } from "react";
import type { BriefingItem } from "@/lib/types";

export default function BriefingItemAccordion({ item }: { item: BriefingItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-2 px-2 hover:bg-[var(--bg-hover)] flex items-center gap-3 group"
      >
        <span className="text-[var(--accent-yellow)] text-xs w-[24px] shrink-0">[{item.order}]</span>
        <div className="grow min-w-0 flex items-baseline justify-between gap-4">
          <span className="font-bold text-sm truncate group-hover:text-[var(--text-bright)]">
            {item.headline}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] shrink-0 hidden sm:inline">
            {item.source.type.toUpperCase()} • {item.source.name}
          </span>
        </div>
        <span className="text-[var(--accent-primary)] shrink-0 w-[12px] text-center">
          {isOpen ? "▾" : "▸"}
        </span>
      </button>

      {isOpen && (
        <div className="pl-10 pr-2 pb-4 pt-2 space-y-4 text-sm">
          <Section title="WHAT HAPPENED" color="var(--accent-orange)">
            <p className="leading-tight">{item.analysis.whatHappened}</p>
          </Section>

          <Section title="BACKGROUND" color="var(--accent-blue)">
            <p className="mb-2 text-xs">
              <span className="text-[var(--text-muted)]">HISTORICAL:</span> {item.analysis.background.historical}
            </p>
            <p className="text-xs">
              <span className="text-[var(--text-muted)]">CAUSATION:</span> {item.analysis.background.causation}
            </p>
          </Section>

          <Section title="KEY POSITIONS" color="var(--accent-yellow)">
            <div className="space-y-1">
              {item.analysis.positions.map((pos, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="font-bold text-[var(--text-bright)] w-[80px] text-right shrink-0">
                    {pos.actor || pos.side}
                  </span>
                  <span className="text-[var(--text-muted)]">|</span>
                  <span>{pos.stance}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="OUTLOOK" color="var(--accent-green)">
            <ul className="space-y-1">
              {item.analysis.outlook.scenarios.map((s, i) => (
                <li key={i} className="text-xs flex gap-2">
                  <span className="text-[var(--text-muted)] whitespace-nowrap">[{s.probability || "?"}]</span>
                  <span>
                    <strong className="text-[var(--text-bright)]">{s.name || s.label}:</strong> {s.description}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="IMPACT" color="var(--accent-red)">
            <div className="space-y-1 text-xs">
              <p><span className="text-[var(--text-muted)]">DIRECT:</span> {item.analysis.impact.direct}</p>
              <p><span className="text-[var(--text-muted)]">INDIRECT:</span> {item.analysis.impact.indirect}</p>
              {item.analysis.impact.watchPoints.map((wp, i) => (
                <div key={i} className="flex gap-2 text-[var(--text-bright)]">
                  <span className="text-[var(--accent-red)]">&gt;</span> {wp}
                </div>
              ))}
            </div>
          </Section>

          {item.references.length > 0 && (
            <Section title="REFERENCES" color="var(--text-muted)">
              {item.references.map((ref, i) => (
                <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer"
                  className="block text-[10px] text-[var(--accent-blue)] hover:underline truncate">
                  [{i + 1}] {ref.title}
                </a>
              ))}
            </Section>
          )}

          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-[10px] text-[var(--text-muted)] pt-2 border-t border-dashed border-[var(--border)]">
              {item.tags.map((tag, i) => <span key={i}>#{tag}</span>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="pl-3 border-l-[3px]" style={{ borderColor: color }}>
      <h4 className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color }}>{title}</h4>
      <div className="text-[var(--text-primary)]">{children}</div>
    </div>
  );
}
