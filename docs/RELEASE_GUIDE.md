# Release Guide

This project is structured to package through Expo/EAS for Android and iOS.

## What is already configured

- Expo SDK 54 app config
- Android package name: `com.rayaraastottatramandali.rampanchanga`
- iOS bundle identifier: `com.rayaraastottatramandali.rampanchanga`
- Initial native versioning:
  - Android `versionCode: 1`
  - iOS `buildNumber: 1`
- EAS build profiles in [eas.json](/E:/Source/UMPanchangaPST/UMPanchangaPST/eas.json)

## Android

From a machine with Node installed:

```bash
npm install
npx expo login
npx eas build -p android --profile preview
```

For Play Store builds:

```bash
npx eas build -p android --profile production
```

Manual items still required before store submission:

- add final app icon
- add Android adaptive icon assets
- create/sign in to the Google Play Console account
- create the Play app entry for the package name above
- review notification appearance on a release build

## iOS

iOS packaging must be done on a Mac directly or through EAS with Apple developer credentials.

### If using EAS

From any machine with Node installed:

```bash
npm install
npx expo login
npx eas build -p ios --profile preview
```

For App Store builds:

```bash
npx eas build -p ios --profile production
```

### If building locally on a Mac

1. Install Xcode from the Mac App Store.
2. Install Xcode command line tools.
3. Install CocoaPods.
4. Install Node.js 20+.
5. Run:

```bash
npm install
npx expo prebuild
npx expo run:ios
```

### Apple-side requirements

- join the Apple Developer Program
- create the App ID for `com.rayaraastottatramandali.rampanchanga`
- create certificates/profiles or let EAS manage them
- create the App Store Connect app record
- upload final screenshots, privacy details, and store metadata

## Assets still needed

These are manual asset tasks, not code blockers:

- app icon
- splash screen / launch artwork
- Android adaptive icon foreground/background
- App Store / Play Store screenshots

## Versioning

Before each production release:

- bump `expo.version` in [app.json](/E:/Source/UMPanchangaPST/UMPanchangaPST/app.json)
- increment Android `versionCode`
- increment iOS `buildNumber`

If using `eas build --profile production`, EAS can auto-increment the native build number.
