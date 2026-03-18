# RAM Panchanga Windows App

This repo contains the Windows desktop app for RAM Panchanga.

The app is built as a Tauri desktop shell around an Expo + React Native Web frontend. It is offline-first and ships bundled Panchanga seed data inside the application.

Core responsibilities:

- render the Panchanga desktop UI
- load bundled seed data into local SQLite on startup
- support Today, Calendar, Special Tithis, Search, and Settings flows
- support English and Kannada UI/localized Panchanga text
- build native Windows installers and desktop executables

This repo does not contain the raw import pipeline. Seed generation belongs in the separate `ram-panchanga-data` repo.

## System Boundary

The project is split into two repos:

1. `ram-panchanga-data`
   Reads raw source files and generates clean seed outputs.
2. `ram-panchanga-app-win`
   Ships those generated seed files inside the Windows desktop app and imports them into local SQLite.

The handoff between the two repos is:

- generate `generated/panchanga-seed-vancouver-pst.json` in the `ram-panchanga-data` repo
- generate `generated/panchanga-seed-chicago-cst.json` in the `ram-panchanga-data` repo
- generate `generated/panchanga-seed-newyork-est.json` in the `ram-panchanga-data` repo
- generate `generated/kannada-transliterations.json` in the `ram-panchanga-data` repo
- copy them into [data/generated](data/generated)

## Repo Structure

- [app](app)
  Expo Router route files and screens
- [src/components](src/components)
  Reusable UI building blocks
- [src/hooks](src/hooks)
  Screen-facing data and startup hooks
- [src/db](src/db)
  SQLite bootstrap, schema, seed import, and repositories
- [src/store](src/store)
  Persisted user settings
- [src/services](src/services)
  Side-effect services such as reminders
- [src/theme](src/theme)
  Theme tokens and providers
- [src/i18n](src/i18n)
  Shared copy and generated Kannada transliterations
- [src-tauri](src-tauri)
  Native Tauri shell, Rust entrypoint, icons, and packaging config
- [docs](docs)
  Architecture, desktop setup, release notes, and codebase guides

## Windows Desktop Stack

- Expo
- React Native
- React Native Web
- Expo Router
- Expo SQLite
- TanStack Query
- Zustand
- Tauri 2
- Rust

## Install

```bash
npm install
```

## Windows Prerequisites

To run or build the desktop app locally on Windows:

- Rust via `rustup`
- Visual Studio Build Tools with MSVC and Windows SDK
- WebView2 runtime

Verify the local setup with:

```bash
npx tauri info
```

## Local Development

Primary desktop workflow:

```bash
npm run desktop:dev
```

Useful commands:

```bash
npm run web
npm run desktop:web
npm run desktop:bundle
npm run desktop:dev
npm run desktop:build
npm run typecheck
npm run lint
npm run test
npm run test:desktop-smoke
```

What each desktop command does:

- `npm run desktop:web`
  Starts the Expo web dev server on port `1420`
- `npm run desktop:dev`
  Starts Tauri against the local web dev server
- `npm run desktop:bundle`
  Exports the web app into `dist`
- `npm run desktop:build`
  Builds Windows installers from the exported `dist`
- `npm run test:desktop-smoke`
  Exports the web app and verifies that the desktop web bundle renders without page or console errors

## Desktop Runtime Notes

- The app uses `expo-sqlite` on web/desktop, which pulls in the bundled wasm asset during web export.
- Reminder scheduling is currently guarded off on web/desktop because the existing implementation is mobile-oriented.
- The current desktop build produces working Windows binaries, but public distribution still needs code signing to avoid SmartScreen friction.
- Target machines still need WebView2 available.

## Documentation

Recommended read order:

1. [docs/WINDOWS_DESKTOP_GUIDE.md](docs/WINDOWS_DESKTOP_GUIDE.md)
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. [docs/CODEBASE_GUIDE.md](docs/CODEBASE_GUIDE.md)
4. [docs/RELEASE_GUIDE.md](docs/RELEASE_GUIDE.md)
5. [app/_layout.tsx](app/_layout.tsx)
6. [src/hooks/useAppBootstrap.ts](src/hooks/useAppBootstrap.ts)
7. [src/db/bootstrap.ts](src/db/bootstrap.ts)
8. [src/db/repositories/panchanga-repository.ts](src/db/repositories/panchanga-repository.ts)
9. [src-tauri/tauri.conf.json](src-tauri/tauri.conf.json)
10. [src-tauri/src/lib.rs](src-tauri/src/lib.rs)

## Release Flow

1. Regenerate seed files in the data repo.
2. Copy the location-specific seed files and `kannada-transliterations.json` into [data/generated](data/generated).
3. Run validation:
   `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:desktop-smoke`
4. Bump versions in [app.json](app.json) and [src-tauri/Cargo.toml](src-tauri/Cargo.toml) as needed.
5. Build installers with `npm run desktop:build`.
6. Code-sign the generated `.exe` and installer before external distribution.

See [docs/RELEASE_GUIDE.md](docs/RELEASE_GUIDE.md) for the full release checklist.
