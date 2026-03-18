# Desktop Architecture

## Purpose

This repo is the offline-first Windows desktop client for RAM Panchanga.

Its responsibilities are:

- present the Panchanga desktop UI
- store bundled Panchanga data in local SQLite
- expose Today, Calendar, Search, Settings, and Special Tithi views
- persist user settings such as location, language, and theme
- package the app into a native Windows executable and installer

Its responsibilities do not include:

- parsing raw spreadsheets
- cleaning source SQLite extracts
- generating seed bundles
- generating analytics exports
- generating ICS calendars

Those belong in the separate data repo.

## Runtime Model

The desktop app has two layers:

1. Web/frontend layer
   Expo + React Native Web renders the UI and owns app state, routing, hooks, repositories, and SQLite access.
2. Native desktop shell
   Tauri hosts the exported web app inside the Windows WebView runtime and builds native installers.

The core app flow is still:

`screen -> hook -> repository -> SQLite -> bundled seed data`

The desktop-specific addition is:

`Tauri window -> exported web bundle -> app shell -> bootstrap -> SQLite seed import`

## Stack

- Expo
- React Native
- React Native Web
- TypeScript
- Expo Router
- Expo SQLite
- TanStack Query
- Zustand
- Tauri 2
- Rust

## Major Layers

### 1. Routing and screens

Folder:
- [app](../app)

Responsibilities:
- define route structure
- lay out loading, empty, error, and content states
- compose reusable screen sections

### 2. Reusable UI components

Folder:
- [src/components](../src/components)

Responsibilities:
- render cards, headers, lists, section shells, and settings controls
- keep route files small and focused

### 3. Hooks

Folder:
- [src/hooks](../src/hooks)

Responsibilities:
- expose screen-friendly query data
- manage startup/bootstrap flow
- combine repository reads with store settings

### 4. Local data layer

Folder:
- [src/db](../src/db)

Responsibilities:
- open the app-local SQLite database
- create/update schema
- import the bundled JSON seed
- expose query repositories for the UI

### 5. Domain helpers

Folder:
- [src/domain](../src/domain)

Responsibilities:
- timezone-aware date calculations
- shared pure transformations
- text and label helpers reused across screens

### 6. App state and services

Folders:
- [src/store](../src/store)
- [src/services](../src/services)

Responsibilities:
- persist user preferences
- coordinate reminders and other side effects
- keep effectful code out of components where possible

Desktop note:
- reminder startup is explicitly guarded on web/desktop because the current notification implementation is mobile-specific

### 7. Theme and types

Folders:
- [src/theme](../src/theme)
- [src/types](../src/types)

Responsibilities:
- define the visual system
- centralize shared TypeScript vocabulary

### 8. Native desktop shell

Folder:
- [src-tauri](../src-tauri)

Responsibilities:
- define Tauri window config
- define packaging targets and app identity
- host the web bundle in a native Windows window
- produce `.msi` and NSIS installers

Important files:

- [src-tauri/tauri.conf.json](../src-tauri/tauri.conf.json)
  Build commands, window settings, identifiers, and bundle settings
- [src-tauri/src/main.rs](../src-tauri/src/main.rs)
  Rust binary entrypoint
- [src-tauri/src/lib.rs](../src-tauri/src/lib.rs)
  Tauri builder setup

## Bootstrap Path

Desktop startup looks like this:

1. Tauri launches the native window.
2. Tauri loads the Expo web dev server in development or `dist` in release.
3. The React app mounts through [app/_layout.tsx](../app/_layout.tsx).
4. [src/hooks/useAppBootstrap.ts](../src/hooks/useAppBootstrap.ts) loads fonts and initializes SQLite.
5. [src/db/bootstrap.ts](../src/db/bootstrap.ts) creates schema and imports bundled seed data.
6. Routes begin reading through repositories and React Query hooks.

## Desktop-Specific Implementation Notes

### SQLite on web/desktop

- The desktop app still uses `expo-sqlite`.
- Metro is configured to keep the SQLite wasm asset available during export.
- The bundled data remains local to the app; there is no runtime backend dependency.

### Settings persistence

- The settings store lives in [src/store/settings-store.ts](../src/store/settings-store.ts).
- The current desktop path uses a Zustand CommonJS import workaround to avoid a web bundling issue with Zustand's package exports.

### Notifications

- [src/services/reminders.ts](../src/services/reminders.ts) and [src/components/app/ReminderCoordinator.tsx](../src/components/app/ReminderCoordinator.tsx) are intentionally guarded on web.
- That avoids boot-time failures from mobile-only notification APIs.
- A future desktop-native reminder implementation would likely move into Tauri plugins or an app-specific scheduling layer.

## Design Principles

- Offline-first: the app should remain useful without a server.
- Stable desktop shell: packaging should not change core app behavior.
- Shared domain logic: desktop should reuse the same repositories, types, and helpers as the app layer.
- Predictable data flow: screens do not contain SQL.
- Explicit platform boundaries: Tauri-specific logic stays in `src-tauri`; UI/runtime logic stays in `app` and `src`.
- Test the exported app: blank-screen regressions should be caught before packaging.

## Suggested Code Reading Order

1. [app/_layout.tsx](../app/_layout.tsx)
2. [src/hooks/useAppBootstrap.ts](../src/hooks/useAppBootstrap.ts)
3. [src/db/bootstrap.ts](../src/db/bootstrap.ts)
4. [src/db/repositories/panchanga-repository.ts](../src/db/repositories/panchanga-repository.ts)
5. [src/store/settings-store.ts](../src/store/settings-store.ts)
6. [src/services/reminders.ts](../src/services/reminders.ts)
7. [src-tauri/tauri.conf.json](../src-tauri/tauri.conf.json)
8. [src-tauri/src/lib.rs](../src-tauri/src/lib.rs)
