# RAM Panchanga App

This repo contains the frontend mobile app for RAM Panchanga.

It is an Expo + React Native app that:

- renders the user interface
- stores generated Panchanga data in local SQLite
- works offline from bundled seed files
- lets users browse today, the calendar, special tithis, and settings

It does not contain the raw import pipeline. That lives in the separate `ram-panchanga-data` repo.

## How This Repo Fits The Overall System

The project is split into two repos:

1. `ram-panchanga-data`
   Reads raw source files and generates clean seed outputs.
2. `ram-panchanga-app`
   Ships those generated seed files inside the mobile app and loads them into SQLite on device startup.

The handoff between the two repos is:

- generate `generated/panchanga-seed-vancouver-pst.json` in the `ram-panchanga-data` repo
- generate `generated/panchanga-seed-chicago-cst.json` in the `ram-panchanga-data` repo
- generate `generated/panchanga-seed-newyork-est.json` in the `ram-panchanga-data` repo
- copy them into [data/generated](data/generated)

## Repo Structure

- [app](app)
  Route files and screens
- [src/components](src/components)
  Reusable UI building blocks
- [src/hooks](src/hooks)
  Screen-facing data and startup hooks
- [src/db](src/db)
  Local SQLite bootstrap and repositories
- [src/store](src/store)
  Persisted user settings
- [src/theme](src/theme)
  Colors, spacing, typography, theme context
- [docs](docs)
  Architecture, codebase guides, release notes, teaching guides

## Install

```bash
npm install
```

## Run Locally

```bash
npm run start
```

Other useful commands:

```bash
npm run android
npm run ios
npm run web
npm run typecheck
npm run lint
npm run test
```

## Learning / Read Order

For a new student or developer:

1. Read [docs/FRONTEND_TEACHING_GUIDE.md](docs/FRONTEND_TEACHING_GUIDE.md)
2. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. Read [docs/CODEBASE_GUIDE.md](docs/CODEBASE_GUIDE.md)
4. Read [app/_layout.tsx](app/_layout.tsx)
5. Read [src/types/domain.ts](src/types/domain.ts)

## Release Flow

1. Regenerate seed files in the data repo.
2. Copy the location-specific seed files into [data/generated](data/generated).
3. Run local validation:
   `npm run typecheck`, `npm run lint`, `npm run test`
4. Bump app version/build numbers in Expo config.
5. Build and publish with Expo/EAS.

See [docs/RELEASE_GUIDE.md](docs/RELEASE_GUIDE.md) for release details.
