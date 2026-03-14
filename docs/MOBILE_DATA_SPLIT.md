# Mobile/Data Split

The mobile app and the data pipeline now belong in separate repos.

## App repo

This repo should contain only:
- Expo app code
- local SQLite bootstrap/runtime
- bundled seed data at `data/generated/panchanga-seed.json`

## Data repo

The separate `ram-panchanga-data` repo should contain:
- raw Panchanga source files
- sunrise and moon timing source files
- manual corrections
- importer and export scripts
- analytics outputs
- ICS generation

## Release flow

1. Regenerate the seed in `ram-panchanga-data`.
2. Copy `generated/panchanga-seed.json` into this repo at `data/generated/panchanga-seed.json`.
3. Build and publish the mobile app.
