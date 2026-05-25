CREATE TABLE IF NOT EXISTS wedding_guests (
  id TEXT PRIMARY KEY,
  main_contact TEXT NOT NULL,
  phone TEXT,
  wechat_id TEXT NOT NULL DEFAULT '',
  guests_json TEXT NOT NULL DEFAULT '[]',
  dietary_restrictions TEXT NOT NULL DEFAULT '',
  is_driving INTEGER NOT NULL DEFAULT 0,
  needs_shuttle INTEGER NOT NULL DEFAULT 0,
  shuttle_location TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wedding_guests_created_at ON wedding_guests (created_at);
