# RAM Panchanga App

This is the Expo mobile app for RAM Panchanga.

It contains:
- the app UI and navigation
- the local SQLite bootstrap and repositories
- the bundled production seed used by the mobile client

It does not contain the raw data import pipeline.

## Data source

The app reads bundled seed data from:
- [data/generated/panchanga-seed-vancouver-pst.json](/E:/Source/UMPanchangaPST/ram-panchanga-app/data/generated/panchanga-seed-vancouver-pst.json)
- [data/generated/panchanga-seed-chicago-cst.json](/E:/Source/UMPanchangaPST/ram-panchanga-app/data/generated/panchanga-seed-chicago-cst.json)
- [data/generated/panchanga-seed-newyork-est.json](/E:/Source/UMPanchangaPST/ram-panchanga-app/data/generated/panchanga-seed-newyork-est.json)

Those files should be generated in the separate `ram-panchanga-data` repo and copied here before a release.

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
2. Copy the three generated seed files into this repo at `data/generated/`.
3. Bump version and build numbers.
4. Build Android/iOS and publish.
