# Example Analysis Prompt

## Filtering Criteria
- Include: [describe what topics to include]
- Exclude: [describe what to filter out]

## Analysis Framework

For each issue, produce a deep analysis following this JSON structure.
**Always use web search for background research.**

### Item JSON Structure

```json
{
  "headline": "One-sentence summary of the event",
  "source": {
    "type": "twitter|rss",
    "name": "Source name (@handle, Reuters, etc.)",
    "url": "Original URL",
    "timestamp": "ISO 8601 (2025-01-15T07:30:00Z)"
  },
  "analysis": {
    "whatHappened": "Core event in 2-3 sentences. Who, what, why. Immediate results/reactions.",
    "background": {
      "historical": "Deep historical context. Origin of the issue, key turning points, how past decisions led to the present situation.",
      "culturalReligious": "Religious conflicts, cultural differences, nationalism (null if not applicable)",
      "causation": "[Cause1] → [Effect A] → [Cause2] → [Effect B] → ... → [Current situation]",
      "timeline": [
        {"date": "1950-06-25", "event": "Historical origin event"},
        {"date": "2025-01-15", "event": "Recent trigger event"}
      ]
    },
    "positions": [
      {
        "side": "Country/faction name",
        "stance": "Official position",
        "coreArgument": "Main argument",
        "hiddenInterest": "Hidden interests/motivations"
      }
    ],
    "outlook": {
      "scenarios": [
        {"name": "Scenario A", "probability": "high|medium|low", "description": "Description"},
        {"name": "Scenario B", "probability": "medium", "description": "Description"},
        {"name": "Worst case", "probability": "low", "description": "Description"}
      ],
      "expertOpinions": ["Expert/analyst opinion 1", "Opinion 2"]
    },
    "impact": {
      "direct": "Immediate impact on your region/industry",
      "indirect": "Medium-to-long-term secondary effects",
      "watchPoints": ["Monitoring point 1", "Action item 2"]
    }
  },
  "references": [
    {"url": "https://...", "title": "Article title"}
  ],
  "tags": ["trade-war", "us-china", "tariff"]
}
```

### Analysis Principles
- Present at least 2-3 perspectives **balanced**
- Timeline: 3-7 key events
- Tags: lowercase kebab-case, 3-5 per item
- References: 2-3 from diverse viewpoints
- Positions: minimum 2
- Scenarios: minimum 2
