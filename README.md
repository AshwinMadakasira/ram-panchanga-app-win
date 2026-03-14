# RAM Panchanga App

This is the Expo mobile app for RAM Panchanga.

It contains:
- the app UI and navigation
- the local SQLite bootstrap and repositories
- the bundled production seed used by the mobile client

It does not contain the raw data import pipeline.

## Data source

The app reads bundled seed data from:
- [data/generated/panchanga-seed.json](/E:/Source/UMPanchangaPST/ram-panchanga-app/data/generated/panchanga-seed.json)

That file should be generated in the separate `ram-panchanga-data` repo and copied here before a release.

## Install

```bash
npm install
```

## Run

```bash
npx expo start
```

Optional native runs:

```bash
npm run android
npm run ios
```

## Test

```bash
npm run typecheck
npm run lint
npm run test
```

## Release flow

1. Regenerate data in the data repo.
2. Copy `generated/panchanga-seed.json` into this repo at `data/generated/panchanga-seed.json`.
3. Bump version and build numbers.
4. Build Android/iOS and publish.
