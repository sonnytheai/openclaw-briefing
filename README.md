# OpenClaw Briefing System

An AI-powered news briefing pipeline for [OpenClaw](https://github.com/openclaw/openclaw).  
Collects news from X/Twitter and RSS feeds, analyzes them with AI agents, stores in SQLite, and delivers summaries via Slack, Telegram, Discord, or any supported channel.

No frontend to deploy. No servers to manage. Just OpenClaw + cron.

## How It Works

```
  Cron (scheduled)
       │
       ▼
  ┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌────────────┐
  │ Collect data │────▶│ AI Analysis  │────▶│ Save to DB  │────▶│ Send alert │
  │ X + RSS      │     │ Deep research│     │ (SQLite)    │     │ Slack/TG   │
  └─────────────┘     └──────────────┘     └─────────────┘     └────────────┘
```

1. **OpenClaw cron** triggers an isolated agent session on schedule
2. **Agent collects** from X/Twitter (`bird` CLI) and RSS feeds (`web_fetch`)
3. **Agent analyzes** each item with web search for deep background research
4. **Agent saves** structured JSON to SQLite via `briefing-db` CLI
5. **Agent sends** a summary to your preferred channel (Slack, Telegram, Discord, etc.)

## Quick Start

### Prerequisites

- [OpenClaw](https://github.com/openclaw/openclaw) installed and running
- Python 3.8+ (for the DB CLI)
- (Optional) [bird CLI](https://github.com/nicepkg/bird) for X/Twitter collection

### 1. Install the Briefing Skill

```bash
# Copy to your OpenClaw workspace
cp -r skills/briefing-db ~/.openclaw/workspace/skills/

# Initialize the database
chmod +x ~/.openclaw/workspace/skills/briefing-db/scripts/briefing-db
~/.openclaw/workspace/skills/briefing-db/scripts/briefing-db init
```

### 2. Configure Your Sources

```bash
# Copy source configs to your workspace
cp -r briefings/ ~/.openclaw/workspace/briefings/

# Edit X/Twitter accounts
vim ~/.openclaw/workspace/briefings/sources/x-accounts.yaml

# Edit RSS feeds
vim ~/.openclaw/workspace/briefings/sources/rss-feeds.yaml
```

### 3. Customize Analysis Prompts

Edit `briefings/analyses/example.md` or create new ones for your topics.  
Each prompt defines what to filter, how to analyze, and the output JSON schema.

### 4. Register Cron Jobs

Tell your OpenClaw agent to set up a cron job. Example chat message:

> Set up a daily briefing cron job at 7:30 AM for technology news.  
> Use the sources in `briefings/sources/` tagged with `technology` and `ai`.  
> Follow the analysis prompt in `briefings/analyses/example.md`.  
> Save results with `briefing-db save` and send a summary to Slack channel #news.

Or register programmatically — see `briefings/jobs/cron-prompt-template.md` for the full agent prompt template.

### 5. (Optional) Seed Demo Data

```bash
python scripts/seed-demo.py
~/.openclaw/workspace/skills/briefing-db/scripts/briefing-db list
```

## Project Structure

```
.
├── briefings/
│   ├── analyses/              # Analysis prompt templates
│   │   └── example.md         # Generic deep-analysis schema
│   ├── jobs/                  # Cron job setup guides
│   │   ├── example-job.yaml   # Job config reference
│   │   └── cron-prompt-template.md  # Agent prompt template
│   └── sources/               # What to monitor
│       ├── x-accounts.yaml    # X/Twitter accounts
│       └── rss-feeds.yaml     # RSS feeds
├── skills/
│   └── briefing-db/           # SQLite storage skill
│       ├── SKILL.md
│       ├── scripts/briefing-db
│       └── references/schema.sql
├── scripts/
│   └── seed-demo.py           # Demo data seeder
└── README.md
```

## Customization

### Adding a New Topic

1. Create `briefings/analyses/your-topic.md` with filtering criteria and JSON schema
2. Tag relevant sources in `x-accounts.yaml` / `rss-feeds.yaml`
3. Register a new cron job with your OpenClaw agent

### Notification Channels

The agent uses OpenClaw's `message` tool to deliver summaries. Supported channels:

- **Slack** — `message(action="send", channel="slack", target="#channel-name", message="...")`
- **Telegram** — `message(action="send", channel="telegram", target="CHAT_ID", message="...")`
- **Discord** — `message(action="send", channel="discord", target="CHANNEL_ID", message="...")`
- **Signal, iMessage, WhatsApp** — Same pattern, different channel name

### Analysis Schema

The default analysis schema includes:

| Field | Description |
|-------|-------------|
| `whatHappened` | Event summary (2-3 sentences) |
| `background` | Historical context, causation chain, timeline |
| `positions` | Multiple stakeholder perspectives |
| `outlook` | Scenarios with probability assessments |
| `impact` | Direct/indirect effects + watch points |

Customize the schema in your analysis prompts to match your needs.

### Database Queries

```bash
# List recent briefings
briefing-db list

# Get a specific briefing
briefing-db get --date 2025-01-15 --type technology

# Filter by type
briefing-db list --type economy --limit 5
```

## Example Output (Slack/Telegram)

```
🤖 Technology Briefing — 2025-01-15

Major AI Lab Announces New Foundation Model

Key Points:
• New model outperforms predecessors on key benchmarks
• Open weights release planned for next month
• Industry racing to match capabilities

Urgency: HIGH | Sentiment: POSITIVE | 12 sources analyzed
```

## License

MIT
