# Seed Data Notes

Use the previously extracted files as the source of truth:
- `panchanga_los_angeles_2026_2027.sqlite`
- `panchanga_los_angeles_2026_2027.xlsx`

Codex should write an import script that:
1. reads the extracted SQLite database
2. maps it into the app schema in `data/schema.sql`
3. creates:
   - one `calendar_day` row per date
   - transition rows for tithi/nakshatra/yoga/karana when parsable
   - special tithi rows from note text
   - muhurtha rows from the muhurtha export

Initial location seed:
- id: `los-angeles-ca`
- name: `Los Angeles`
- region: `CA`
- country: `USA`
- timezone: `America/Los_Angeles`
