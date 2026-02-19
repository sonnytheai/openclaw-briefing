# Cron Job Prompt Template

Use this as a template for the `message` field in your OpenClaw cron job's `agentTurn` payload.
Replace placeholders (in `{BRACKETS}`) with your values.

---

## Agent Prompt

```
Collect and analyze {TOPIC} news briefing.

## Time Window
**Only use content published within the last 24 hours.**

## Sources
Read `~/.openclaw/workspace/briefings/sources/x-accounts.yaml` and `rss-feeds.yaml`.
Use accounts/feeds tagged with: {TAG1}, {TAG2}, {TAG3}

## Data Collection

### Step 1: X/Twitter (Priority)
Collect recent tweets using `bird` CLI:

- bird user-tweets {HANDLE1} --count 10 --plain
- bird user-tweets {HANDLE2} --count 10 --plain
- bird user-tweets {HANDLE3} --count 10 --plain

### Step 2: RSS (Supplementary)
Use web_fetch to read RSS feeds for topics not covered by X.

## Filtering
Select top 10-15 items from the last 24 hours.
Prioritize X sources; use RSS to fill gaps.
Include diverse perspectives.

## Analysis
Read `~/.openclaw/workspace/briefings/analyses/{ANALYSIS_FILE}.md` and follow its JSON structure.
For each issue, use web search for background research.

## Save to Database
Write JSON to `/tmp/briefing-{TOPIC}.json`:

{
  "meta": {"job": "{JOB_NAME}", "date": "YYYY-MM-DD", "analysisType": "{TOPIC}"},
  "summary": {"headline": "...", "keyPoints": [...], "sentiment": "...", "urgency": "..."},
  "items": [...]
}

Save:
~/.openclaw/workspace/skills/briefing-db/scripts/briefing-db save --input /tmp/briefing-{TOPIC}.json

## Send Notification
message(action="send", channel="{CHANNEL}", target="{TARGET}", message="{EMOJI} {TOPIC} Briefing — YYYY-MM-DD\n\n{headline}\n\nKey Points:\n• point1\n• point2\n\nUrgency: {urgency} | Sentiment: {sentiment} | {N} sources analyzed")
```

---

## OpenClaw Cron Registration

Register via OpenClaw's cron API or ask your agent to create it:

```json
{
  "name": "daily-{TOPIC}-briefing",
  "schedule": {
    "kind": "cron",
    "expr": "30 7 * * *",
    "tz": "{YOUR_TIMEZONE}"
  },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "... (paste the agent prompt above with placeholders filled) ..."
  },
  "delivery": {
    "mode": "announce",
    "channel": "{CHANNEL}",
    "to": "{TARGET}"
  }
}
```

### Placeholders

| Placeholder | Example |
|-------------|---------|
| `{TOPIC}` | technology, politics, economy |
| `{TAG1}, {TAG2}` | ai, research, semiconductor |
| `{HANDLE1}` | karpathy, OpenAI |
| `{ANALYSIS_FILE}` | example |
| `{JOB_NAME}` | morning-tech |
| `{CHANNEL}` | slack, telegram, discord |
| `{TARGET}` | #news, CHAT_ID, CHANNEL_ID |
| `{EMOJI}` | 🤖, 🏛️, 💰 |
| `{YOUR_TIMEZONE}` | America/New_York, Asia/Tokyo |
