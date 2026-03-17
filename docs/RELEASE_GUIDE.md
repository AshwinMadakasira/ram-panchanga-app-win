# App Release Guide

This guide describes how to release the frontend mobile app.

## Before You Build

1. Regenerate the seed files in the data repo.
2. Copy the three location seeds into [data/generated](../data/generated).
3. Run:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run test`
4. Verify the app visually in Expo/simulator.

## Current app identifiers

- Android package:
  `com.rayaraastottatramandali.rampanchanga`
- iOS bundle identifier:
  `com.rayaraastottatramandali.rampanchanga`

## Versioning

Before each production release:

- bump `expo.version` in [app.json](../app.json)
- increment Android `versionCode`
- increment iOS `buildNumber`

## EAS builds

Build profiles live in [eas.json](../eas.json).

### Android

```bash
npm install
npx expo login
npx eas build -p android --profile preview
```

Production:

```bash
npx eas build -p android --profile production
```

### iOS

```bash
npm install
npx expo login
npx eas build -p ios --profile preview
```

Production:

```bash
npx eas build -p ios --profile production
```

## Manual release checklist

- verify updated seed files are included
- verify icon/splash/store assets are current
- verify notifications behave correctly on release builds
- verify store metadata, screenshots, and privacy entries are current

## Related docs

- [README.md](../README.md)
- [docs/MOBILE_DATA_SPLIT.md](./MOBILE_DATA_SPLIT.md)
