-- Briefing Database Schema
-- SQLite

-- Briefing metadata
CREATE TABLE IF NOT EXISTS briefings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_name TEXT NOT NULL,
    date TEXT NOT NULL,                    -- YYYY-MM-DD
    analysis_type TEXT NOT NULL,           -- politics, economy, technology, etc.
    headline TEXT,
    sentiment TEXT,                        -- positive, negative, neutral, mixed
    urgency TEXT,                          -- low, medium, high, critical
    key_points TEXT,                       -- JSON array
    source_count INTEGER DEFAULT 0,
    item_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    
    UNIQUE(date, analysis_type)
);

-- Individual analysis items
CREATE TABLE IF NOT EXISTS briefing_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    briefing_id INTEGER NOT NULL,
    item_order INTEGER NOT NULL,
    headline TEXT NOT NULL,
    
    -- Source info
    source_type TEXT,                      -- twitter, rss
    source_name TEXT,                      -- @handle, Reuters, etc.
    source_url TEXT,
    source_timestamp TEXT,
    
    -- Analysis content
    what_happened TEXT,
    background_historical TEXT,
    background_cultural TEXT,
    background_causation TEXT,
    timeline TEXT,                         -- JSON array
    positions TEXT,                        -- JSON array
    outlook TEXT,                          -- JSON object
    
    -- Impact analysis (customize field names for your region/focus)
    impact_direct TEXT,
    impact_indirect TEXT,
    impact_watch_points TEXT,              -- JSON array
    
    -- References and tags
    references_json TEXT,                  -- JSON array
    tags TEXT,                             -- JSON array
    
    created_at TEXT DEFAULT (datetime('now')),
    
    FOREIGN KEY (briefing_id) REFERENCES briefings(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_briefings_date ON briefings(date);
CREATE INDEX IF NOT EXISTS idx_briefings_type ON briefings(analysis_type);
CREATE INDEX IF NOT EXISTS idx_items_briefing ON briefing_items(briefing_id);
