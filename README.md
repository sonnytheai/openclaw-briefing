# OpenClaw Briefing System

An AI-powered news briefing pipeline built on [OpenClaw](https://github.com/openclaw/openclaw). Collects news from X/Twitter and RSS feeds, analyzes them using AI agents, stores results in SQLite, and displays them on a Next.js dashboard.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   OpenClaw Agent                     │
│                                                      │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────┐ │
│  │  Cron     │──▶│ Collect  │──▶│  AI Analysis     │ │
│  │  Schedule │   │ X + RSS  │   │  (Deep Research) │ │
│  └──────────┘   └──────────┘   └────────┬─────────┘ │
│                                          │           │
│                              ┌───────────▼─────────┐ │
│                              │  briefing-db CLI    │ │
│                              │  (Save to SQLite)   │ │
│                              └───────────┬─────────┘ │
└──────────────────────────────────────────┼───────────┘
                                           │
                                   ┌───────▼───────┐
                                   │  SQLite DB    │
                                   │  briefings.db │
                                   └───────┬───────┘
                                           │
                                   ┌───────▼───────┐
                                   │  Next.js FE   │
                                   │  Dashboard    │
                                   └───────────────┘
```

## Components

### 1. Briefing Skill (`skills/briefing-db/`)
SQLite CLI for storing and querying briefing data.

### 2. Source Definitions (`briefings/sources/`)
YAML files defining which X accounts and RSS feeds to monitor, with tags for filtering.

### 3. Analysis Prompts (`briefings/analyses/`)
Markdown files with JSON schemas that guide the AI agent's analysis format.

### 4. Cron Job Templates (`briefings/jobs/`)
Example cron job configurations for OpenClaw's scheduler.

### 5. Frontend (`frontend/`)
Next.js dashboard that reads directly from the SQLite DB.

## Quick Start

### Prerequisites
- [OpenClaw](https://github.com/openclaw/openclaw) installed and running
- Node.js 18+
- Python 3.8+
- (Optional) [bird CLI](https://github.com/openclaw/bird) for X/Twitter collection

### 1. Set Up the Briefing Skill

```bash
# Copy the skill to your OpenClaw workspace
cp -r skills/briefing-db ~/.openclaw/workspace/skills/

# Initialize the database
~/.openclaw/workspace/skills/briefing-db/scripts/briefing-db init
```

### 2. Configure Sources

Edit the source files to match your interests:

```bash
# Edit X/Twitter accounts to follow
vim briefings/sources/x-accounts.yaml

# Edit RSS feeds
vim briefings/sources/rss-feeds.yaml
```

### 3. Customize Analysis Prompts

Edit or create analysis prompts in `briefings/analyses/`. Each file defines:
- Filtering criteria (what to include/exclude)
- JSON output schema
- Analysis principles

### 4. Set Up Cron Jobs

Use OpenClaw's cron system to schedule collection:

```bash
# See briefings/jobs/ for example configurations
# Register via OpenClaw's cron API or chat interface
```

### 5. Deploy the Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit DATABASE_PATH in .env.local

npm run dev    # Development
npm run build  # Production build
```

### Docker Deployment

```bash
cd frontend
docker build -t briefing-dashboard .
docker compose up -d
```

## Customization

### Adding a New Topic

1. **Create an analysis prompt**: `briefings/analyses/your-topic.md`
2. **Tag relevant sources**: Add tags in `x-accounts.yaml` and `rss-feeds.yaml`
3. **Create a cron job**: Schedule collection in OpenClaw

### Analysis Prompt Structure

Each analysis prompt defines:
- **Filtering criteria**: What news to include/exclude
- **JSON schema**: The structure for each analyzed item
- **Analysis principles**: Guidelines for depth, balance, data requirements

See `briefings/analyses/example.md` for a complete template.

### Extending the Schema

The default schema includes:
- `whatHappened`: Event summary
- `background`: Historical context, causation, timeline
- `positions`: Multiple stakeholder perspectives
- `outlook`: Scenarios with probabilities
- `impact`: Regional/personal impact analysis

You can customize `skills/briefing-db/references/schema.sql` and the analysis prompts to add fields specific to your use case.

## Project Structure

```
.
├── briefings/
│   ├── analyses/          # Analysis prompt templates
│   │   ├── example.md     # Generic template
│   │   └── ...
│   ├── jobs/              # Cron job configurations
│   │   └── example-job.yaml
│   └── sources/           # Source definitions
│       ├── x-accounts.yaml
│       └── rss-feeds.yaml
├── skills/
│   └── briefing-db/       # Database CLI skill
│       ├── SKILL.md
│       ├── scripts/
│       │   └── briefing-db
│       └── references/
│           └── schema.sql
├── frontend/              # Next.js dashboard
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── docker-compose.yml
└── README.md
```

## How the Pipeline Works

1. **Cron triggers** an isolated OpenClaw agent session at scheduled times
2. **Agent collects** data from X/Twitter (via `bird` CLI) and RSS (via `web_fetch`)
3. **Agent analyzes** each item using web search for deep background research
4. **Agent saves** structured JSON to SQLite via `briefing-db` CLI
5. **Agent notifies** via configured channel (Telegram, Discord, etc.)
6. **Frontend reads** the SQLite DB and displays the briefings

## License

MIT
