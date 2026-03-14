export const appSchemaSql = `
CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS location (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT,
  country TEXT,
  timezone TEXT NOT NULL,
  latitude REAL,
  longitude REAL
);

CREATE TABLE IF NOT EXISTS calendar_day (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  location_id TEXT NOT NULL,
  weekday TEXT NOT NULL,
  gregorian_month TEXT NOT NULL,
  gregorian_day INTEGER NOT NULL,
  gregorian_year INTEGER NOT NULL,
  lunar_month TEXT NOT NULL,
  adhika_month_flag INTEGER NOT NULL DEFAULT 0,
  primary_tithi_at_sunrise TEXT,
  primary_nakshatra_at_sunrise TEXT,
  primary_yoga_at_sunrise TEXT,
  primary_karana_at_sunrise TEXT,
  sunrise TEXT,
  sunset TEXT,
  moonrise TEXT,
  moonset TEXT,
  special_tithi_raw_text TEXT,
  source_page INTEGER,
  FOREIGN KEY (location_id) REFERENCES location(id)
);

CREATE INDEX IF NOT EXISTS idx_calendar_day_date ON calendar_day(date);
CREATE INDEX IF NOT EXISTS idx_calendar_day_location_date ON calendar_day(location_id, date);

CREATE TABLE IF NOT EXISTS day_transition (
  id TEXT PRIMARY KEY,
  calendar_day_id TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  starts_at TEXT,
  ends_at TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  raw_source_text TEXT,
  FOREIGN KEY (calendar_day_id) REFERENCES calendar_day(id)
);

CREATE INDEX IF NOT EXISTS idx_day_transition_day_type ON day_transition(calendar_day_id, type);

CREATE TABLE IF NOT EXISTS special_tithi (
  id TEXT PRIMARY KEY,
  calendar_day_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  raw_text TEXT,
  FOREIGN KEY (calendar_day_id) REFERENCES calendar_day(id)
);

CREATE INDEX IF NOT EXISTS idx_special_tithi_day ON special_tithi(calendar_day_id);
CREATE INDEX IF NOT EXISTS idx_special_tithi_name ON special_tithi(name);

CREATE TABLE IF NOT EXISTS ekadashi (
  id TEXT PRIMARY KEY,
  calendar_day_id TEXT NOT NULL,
  date TEXT NOT NULL,
  location_id TEXT NOT NULL,
  variant TEXT NOT NULL,
  name TEXT,
  display_name TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  FOREIGN KEY (calendar_day_id) REFERENCES calendar_day(id),
  FOREIGN KEY (location_id) REFERENCES location(id)
);

CREATE INDEX IF NOT EXISTS idx_ekadashi_date ON ekadashi(date);
CREATE INDEX IF NOT EXISTS idx_ekadashi_day ON ekadashi(calendar_day_id);

CREATE TABLE IF NOT EXISTS punyadina (
  id TEXT PRIMARY KEY,
  calendar_day_id TEXT NOT NULL,
  date TEXT NOT NULL,
  location_id TEXT NOT NULL,
  honoree TEXT NOT NULL,
  details TEXT,
  display_name TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  FOREIGN KEY (calendar_day_id) REFERENCES calendar_day(id),
  FOREIGN KEY (location_id) REFERENCES location(id)
);

CREATE INDEX IF NOT EXISTS idx_punyadina_date ON punyadina(date);
CREATE INDEX IF NOT EXISTS idx_punyadina_day ON punyadina(calendar_day_id);

CREATE TABLE IF NOT EXISTS time_window (
  id TEXT PRIMARY KEY,
  calendar_day_id TEXT NOT NULL,
  type TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  notes TEXT,
  FOREIGN KEY (calendar_day_id) REFERENCES calendar_day(id)
);

CREATE INDEX IF NOT EXISTS idx_time_window_day_type ON time_window(calendar_day_id, type);

CREATE TABLE IF NOT EXISTS muhurtha (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  location_id TEXT NOT NULL,
  type TEXT NOT NULL,
  paksha_section TEXT,
  solar_masa TEXT,
  vara TEXT,
  tithi TEXT,
  nakshatra TEXT,
  yoga TEXT,
  lagna TEXT,
  notes TEXT,
  raw_fields TEXT,
  FOREIGN KEY (location_id) REFERENCES location(id)
);

CREATE INDEX IF NOT EXISTS idx_muhurtha_date_type ON muhurtha(date, type);
`;
