---
name: briefing-db
description: SQLite database for storing and retrieving news briefings. Use when saving analysis results to database, querying past briefings, or managing briefing history. Commands: init (create tables), save (store briefing JSON), get (retrieve by date/type), list (recent briefings).
---

# Briefing Database

SQLite-based news briefing storage and retrieval system.

## Database Location

```
~/.openclaw/workspace/briefings/briefings.db
```

Override with `--db /path/to/db` or `BRIEFING_DB_PATH` environment variable.

## CLI Usage

### Initialize (Create Tables)

```bash
briefing-db init
```

### Save Briefing

```bash
briefing-db save --input /path/to/briefing.json
```

Or via stdin:

```bash
cat briefing.json | briefing-db save --stdin
```

### Query Briefings

```bash
# By date
briefing-db get --date 2025-01-15

# By date + type
briefing-db get --date 2025-01-15 --type politics

# By ID
briefing-db get --id 1
```

### List Briefings

```bash
# Recent 10
briefing-db list

# Custom limit
briefing-db list --limit 20

# Filter by type
briefing-db list --type politics
```

## JSON Input Format

```json
{
  "meta": {
    "job": "morning-politics",
    "date": "2025-01-15",
    "analysisType": "politics",
    "headline": "Main headline summary"
  },
  "summary": {
    "keyPoints": ["Point 1", "Point 2"],
    "sentiment": "mixed",
    "urgency": "high"
  },
  "items": [
    {
      "headline": "...",
      "source": { "type": "twitter", "name": "@example", "url": "..." },
      "analysis": { ... }
    }
  ]
}
```

See `references/schema.sql` for the full database schema.
