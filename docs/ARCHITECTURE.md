# App Architecture

## Purpose

The app repo is the offline-first mobile client for RAM Panchanga.

Its responsibilities are:

- present the Panchanga UI
- store bundled data in local SQLite
- expose day, month, search, and special-tithi views
- persist user preferences such as location, theme, and reminders
- schedule local notifications based on stored settings

Its responsibilities do not include:

- parsing raw spreadsheets
- cleaning source SQLite extracts
- generating seed bundles
- generating analytics exports
- generating ICS calendars

Those belong in the separate data repo.

## Stack

- Expo
- React Native
- TypeScript
- Expo Router
- Expo SQLite
- TanStack Query
- Zustand
- Expo Notifications
- NativeWind

## Core idea

The app is designed around this flow:

`screen -> hook -> repository -> SQLite -> bundled seed data`

That separation keeps UI code understandable and keeps data access centralized.

## Layers

### 1. Routing and screens

Folder:
- [app](../app)

Responsibilities:
- define route structure
- choose which sections each screen shows
- decide how loading, empty, error, and content states are arranged

### 2. Reusable UI components

Folder:
- [src/components](../src/components)

Responsibilities:
- render repeatable UI blocks such as cards, headers, lists, and controls
- keep screens from becoming large and repetitive

### 3. Hooks

Folder:
- [src/hooks](../src/hooks)

Responsibilities:
- expose screen-friendly data and startup logic
- wrap repository calls with React Query
- combine store data and query data where useful

### 4. Local data layer

Folder:
- [src/db](../src/db)

Responsibilities:
- open the device-local SQLite database
- create/update schema
- import the bundled JSON seed into SQLite
- query the database through repositories

### 5. Domain helpers

Folder:
- [src/domain](../src/domain)

Responsibilities:
- timezone-aware date calculations
- human-friendly labels
- pure transformation logic reused across screens

### 6. App state and services

Folders:
- [src/store](../src/store)
- [src/services](../src/services)

Responsibilities:
- persist user settings
- manage reminders and notifications
- keep side effects out of UI components when possible

### 7. Theme and types

Folders:
- [src/theme](../src/theme)
- [src/types](../src/types)

Responsibilities:
- keep visual design consistent
- define shared TypeScript vocabulary

## Design principles

- Offline-first: the app should remain useful without a server.
- Predictable navigation: primary views stay in tabs; secondary tasks live in stack routes.
- Shared screen chrome: the year banner and top title/search row are rendered by `ScreenContainer`, not repeated per screen.
- Reusable UI: repeated card/list patterns should be extracted.
- Beginner-readable data flow: screens do not contain SQL.
- Location-aware correctness: "today" depends on the selected timezone.
- Curated observances: reminder-facing special-tithi flows currently emphasize `Ekadashi`, `Pournami`, and `Punyadina`.

## Suggested code reading order

1. [app/_layout.tsx](../app/_layout.tsx)
2. [src/types/domain.ts](../src/types/domain.ts)
3. [src/theme/index.ts](../src/theme/index.ts)
4. [src/db/bootstrap.ts](../src/db/bootstrap.ts)
5. [src/db/repositories/panchanga-repository.ts](../src/db/repositories/panchanga-repository.ts)
6. [src/hooks/usePanchangaQueries.ts](../src/hooks/usePanchangaQueries.ts)
7. [app/(tabs)/index.tsx](../app/(tabs)/index.tsx)
