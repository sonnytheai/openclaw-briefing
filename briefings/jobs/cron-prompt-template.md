# Cron Job Prompt Template

Use this as a template for the `message` field in your OpenClaw cron job's `agentTurn` payload.
Replace placeholders (in `{BRACKETS}`) with your values.

---

```
Collect and analyze {TOPIC} news briefing.

## 0. Time Window
**Only use content published within the last 24 hours.** Ignore older content.

## 1. Sources
Read `{WORKSPACE}/briefings/sources/x-accounts.yaml` and `rss-feeds.yaml`.
Use accounts/feeds tagged with: {TAG1}, {TAG2}, {TAG3}

## 2. Data Collection

### Step 1: X/Twitter (Priority)
Collect recent tweets using `bird` CLI:
```bash
bird user-tweets {HANDLE} --count 10 --plain
```

Accounts to collect:
- bird user-tweets {HANDLE1} --count 10 --plain
- bird user-tweets {HANDLE2} --count 10 --plain
- ...

### Step 2: RSS (Supplementary)
Use web_fetch to read RSS feeds for topics not covered by X:
- {FEED1}
- {FEED2}

## 3. Filtering
Select top 10-15 items. Prioritize X sources. Use RSS to fill gaps.
Record source info accurately: type: "twitter", name: "@handle"

## 4. Deep Analysis
Read `{WORKSPACE}/briefings/analyses/{ANALYSIS_FILE}.md` and follow the JSON structure.
For each issue, use web search for background research:
```bash
mcporter call 'exa.web_search_exa(query: "search term", numResults: 3)'
```

## 5. Save to Database
Write JSON to `/tmp/briefing-{TOPIC}.json`:
```json
{"meta": {"job": "{JOB_NAME}", "date": "YYYY-MM-DD", "analysisType": "{TOPIC}"}, "summary": {...}, "items": [...]}
```

Save:
```bash
{WORKSPACE}/skills/briefing-db/scripts/briefing-db save --input /tmp/briefing-{TOPIC}.json
```

## 6. Notification
```
message(action="send", channel="{CHANNEL}", target="{TARGET_ID}", message="{EMOJI} {TOPIC} Briefing - YYYY-MM-DD\n\n{headline}\n\n📖 {DASHBOARD_URL}/briefing/YYYY-MM-DD/{TOPIC}")
```
```

---

## OpenClaw Cron Registration Example

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
    "message": "... (paste the prompt above with placeholders filled) ..."
  },
  "delivery": {
    "mode": "announce",
    "channel": "{CHANNEL}",
    "to": "{TARGET_ID}"
  }
}
```
