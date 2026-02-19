#!/usr/bin/env python3
"""
Seed the database with demo data to preview the dashboard.
Usage: python scripts/seed-demo.py [--db path/to/briefings.db]
"""

import json
import os
import sqlite3
import sys
from datetime import datetime, timedelta

DB_PATH = sys.argv[2] if len(sys.argv) > 2 and sys.argv[1] == "--db" else os.environ.get(
    "BRIEFING_DB_PATH",
    os.path.expanduser("~/.openclaw/workspace/briefings/briefings.db")
)

SCHEMA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                           "skills", "briefing-db", "references", "schema.sql")

os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
conn = sqlite3.connect(DB_PATH)

# Init schema
with open(SCHEMA_PATH) as f:
    conn.executescript(f.read())

today = datetime.now().strftime("%Y-%m-%d")
yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

demo_briefings = [
    {
        "date": today,
        "type": "technology",
        "headline": "Major AI Lab Announces New Foundation Model",
        "sentiment": "positive",
        "urgency": "high",
        "key_points": ["New model outperforms predecessors on key benchmarks", "Open weights release planned"],
        "items": [
            {
                "headline": "Foundation Model Breakthrough",
                "source_type": "twitter",
                "source_name": "@AIResearcher",
                "what_happened": "A major AI lab announced a new foundation model that achieves state-of-the-art results.",
                "background_historical": "The AI field has seen rapid progress since the transformer architecture was introduced in 2017.",
                "background_causation": "Scaling laws → Larger models → Better performance → More investment → Current breakthrough",
                "positions": json.dumps([
                    {"actor": "AI Lab", "stance": "Pushing open research forward"},
                    {"actor": "Competitors", "stance": "Racing to match capabilities"},
                    {"actor": "Regulators", "stance": "Monitoring safety implications"}
                ]),
                "outlook": json.dumps({
                    "scenarios": [
                        {"name": "Rapid adoption", "probability": "high", "description": "Enterprise adoption within months"},
                        {"name": "Regulatory response", "probability": "medium", "description": "New AI governance frameworks"}
                    ]
                }),
                "impact_direct": "Developers can build more capable applications",
                "impact_indirect": "Job market shifts in knowledge work sectors",
                "impact_watch_points": json.dumps(["Benchmark results", "Safety evaluations"]),
                "tags": json.dumps(["ai", "foundation-model", "open-source"])
            }
        ]
    },
    {
        "date": today,
        "type": "economy",
        "headline": "Central Bank Signals Policy Shift",
        "sentiment": "mixed",
        "urgency": "medium",
        "key_points": ["Interest rate decision expected next week", "Markets reacting to mixed signals"],
        "items": [
            {
                "headline": "Fed Chair Testimony Highlights",
                "source_type": "rss",
                "source_name": "Financial Times",
                "what_happened": "The central bank chair testified before congress, signaling potential policy changes.",
                "background_historical": "Central banks have been navigating post-pandemic inflation dynamics since 2022.",
                "background_causation": "Pandemic stimulus → Inflation surge → Rate hikes → Current plateau → Potential shift",
                "positions": json.dumps([
                    {"actor": "Central Bank", "stance": "Data-dependent approach"},
                    {"actor": "Markets", "stance": "Pricing in rate adjustments"},
                    {"actor": "Businesses", "stance": "Seeking clarity on borrowing costs"}
                ]),
                "outlook": json.dumps({
                    "scenarios": [
                        {"name": "Gradual easing", "probability": "high", "description": "Slow rate reductions over 6 months"},
                        {"name": "Hold steady", "probability": "medium", "description": "Rates unchanged through year"}
                    ]
                }),
                "impact_direct": "Mortgage rates and business loans affected",
                "impact_indirect": "Currency movements and trade balances",
                "impact_watch_points": json.dumps(["CPI data", "Employment figures", "GDP growth"]),
                "tags": json.dumps(["interest-rate", "monetary-policy", "inflation"])
            }
        ]
    },
    {
        "date": yesterday,
        "type": "technology",
        "headline": "Semiconductor Supply Chain Shifts",
        "sentiment": "neutral",
        "urgency": "medium",
        "key_points": ["New fab construction announced", "Supply diversification accelerating"],
        "items": []
    }
]

cur = conn.cursor()

for b in demo_briefings:
    cur.execute('''
        INSERT OR REPLACE INTO briefings 
        (job_name, date, analysis_type, headline, sentiment, urgency, key_points, source_count, item_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        f"demo-{b['type']}", b['date'], b['type'], b['headline'],
        b['sentiment'], b['urgency'],
        json.dumps(b['key_points'], ensure_ascii=False),
        len(b['items']), len(b['items'])
    ))
    briefing_id = cur.lastrowid
    
    for idx, item in enumerate(b['items']):
        cur.execute('''
            INSERT INTO briefing_items 
            (briefing_id, item_order, headline, source_type, source_name, source_url, source_timestamp,
             what_happened, background_historical, background_cultural, background_causation, timeline,
             positions, outlook, impact_direct, impact_indirect, impact_watch_points,
             references_json, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            briefing_id, idx + 1, item['headline'],
            item['source_type'], item['source_name'], '', '',
            item['what_happened'], item['background_historical'], '',
            item['background_causation'], '[]',
            item['positions'], item['outlook'],
            item['impact_direct'], item['impact_indirect'],
            item['impact_watch_points'], '[]', item['tags']
        ))

conn.commit()
conn.close()
print(f"✅ Demo data seeded to {DB_PATH}")
print(f"   {len(demo_briefings)} briefings created")
