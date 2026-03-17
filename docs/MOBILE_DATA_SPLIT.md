# Mobile / Data Repo Boundary

The project is intentionally split into two repos.

## App repo: `ram-panchanga-app`

This repo owns:

- Expo/React Native UI code
- local SQLite bootstrap/runtime logic
- persisted settings and reminders
- copied generated seed files in [data/generated](../data/generated)

This repo does not own:

- raw source spreadsheets
- raw source SQLite extracts
- data import scripts
- analytics export scripts
- ICS generation scripts

## Data repo: `ram-panchanga-data`

The separate data repo owns:

- raw/extracted source inputs
- correction rules
- import pipeline scripts
- analytics outputs
- ICS outputs
- generated seed bundles for each location

## Current handoff artifacts

The app repo expects these files from the data repo:

- `panchanga-seed-vancouver-pst.json`
- `panchanga-seed-chicago-cst.json`
- `panchanga-seed-newyork-est.json`

They are copied into:

- [data/generated](../data/generated)

## Release flow

1. Regenerate the seed files in `ram-panchanga-data`.
2. Copy the three location-specific seed files into this repo at [data/generated](../data/generated).
3. Validate the app.
4. Build and publish the mobile app.
