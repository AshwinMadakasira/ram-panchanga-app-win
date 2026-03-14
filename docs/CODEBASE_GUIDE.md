# Codebase Guide

This guide explains what each important hand-written file does in the `RAM Panchanga` app. It is meant for someone new to Expo, React Native, and this project. Generated files like `package-lock.json`, imported source datasets, and bundled seed JSON are not described in detail here because they are outputs, not code you normally edit.

## Root files

- [README.md](/E:/Source/UMPanchangaPST/UMPanchangaPST/README.md): the main project introduction, setup instructions, and the first file a new developer should read.
- [app.json](/E:/Source/UMPanchangaPST/UMPanchangaPST/app.json): Expo app metadata such as the app name, bundle identifiers, description, plugins, and notification permissions text.
- [package.json](/E:/Source/UMPanchangaPST/UMPanchangaPST/package.json): the mobile app project manifest that lists Expo run, lint, and test scripts plus the runtime and development dependencies needed by the client.
- [babel.config.js](/E:/Source/UMPanchangaPST/UMPanchangaPST/babel.config.js): Babel setup for Expo and NativeWind so the app code can be transformed correctly before bundling.
- [metro.config.js](/E:/Source/UMPanchangaPST/UMPanchangaPST/metro.config.js): Metro bundler customization, mainly used when React Native needs non-default module handling.
- [eslint.config.js](/E:/Source/UMPanchangaPST/UMPanchangaPST/eslint.config.js): lint rules that catch common TypeScript and React mistakes before they become runtime bugs.
- [tailwind.config.js](/E:/Source/UMPanchangaPST/UMPanchangaPST/tailwind.config.js): NativeWind/Tailwind configuration. Even though the app mostly uses `StyleSheet`, this keeps the styling toolchain valid.
- [tsconfig.json](/E:/Source/UMPanchangaPST/UMPanchangaPST/tsconfig.json): TypeScript compiler rules, path aliases, and strictness settings.
- [expo-env.d.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/expo-env.d.ts): Expo TypeScript environment declarations.
- [nativewind-env.d.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/nativewind-env.d.ts): TypeScript declarations needed by NativeWind.
- [global.css](/E:/Source/UMPanchangaPST/UMPanchangaPST/global.css): global stylesheet entry for NativeWind/web support.
- [manifest.json](/E:/Source/UMPanchangaPST/UMPanchangaPST/manifest.json): web app manifest used when the Expo app is built for the web.
- [data/schema.sql](/E:/Source/UMPanchangaPST/UMPanchangaPST/data/schema.sql): the database design in plain SQL, useful when you want to understand the tables without reading repository code.
- [tasks/IMPLEMENTATION_BACKLOG.md](/E:/Source/UMPanchangaPST/UMPanchangaPST/tasks/IMPLEMENTATION_BACKLOG.md): the running checklist of deferred or future work.

## Routing and screens

- [app/_layout.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/app/_layout.tsx): the root app shell. It sets up React Query, theme providers, notification coordination, and the main stack navigator.
- [app/+not-found.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/app/+not-found.tsx): the fallback screen shown when a route does not exist.
- [app/search.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/app/search.tsx): the full-screen search route that lets users search dates, special tithis, and muhurthas.
- [app/day/[date].tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/app/day/[date].tsx): the day detail screen for one exact date. This is where the app shows the full Panchanga breakdown.

## Tab screens

- [app/(tabs)/_layout.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/app/(tabs)/_layout.tsx): the bottom-tab navigator setup, including tab titles, icons, and theme-aware tab styling.
- [app/(tabs)/index.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/app/(tabs)/index.tsx): the home or "today" screen. It shows the most important daily information first.
- [app/(tabs)/calendar.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/app/(tabs)/calendar.tsx): the month calendar screen with the grid of days and quick navigation into a selected date.
- [app/(tabs)/special-tithis.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/app/(tabs)/special-tithis.tsx): the special tithis list screen with category filtering.
- [app/(tabs)/muhurthas.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/app/(tabs)/muhurthas.tsx): the muhurtha list screen route. It still exists in code, but it is currently not exposed in the main tab bar.
- [app/(tabs)/settings.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/app/(tabs)/settings.tsx): the settings screen for theme, location, reminder preferences, and app data metadata.

## App coordination

- [src/components/app/ReminderCoordinator.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/app/ReminderCoordinator.tsx): a non-visual component that requests notification permission at startup, keeps scheduled reminders in sync, and handles tapping a notification.

## Reusable calendar components

- [src/components/calendar/MonthGrid.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/calendar/MonthGrid.tsx): renders a month as a Monday-first calendar grid and delegates each day cell to a smaller component.
- [src/components/calendar/CalendarDayCell.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/calendar/CalendarDayCell.tsx): displays one calendar day card, including today highlighting, tithi text, and special tithi markers.

## Reusable content cards

- [src/components/cards/DateHero.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/cards/DateHero.tsx): the top banner card used on date-based screens to make the selected day feel prominent.
- [src/components/cards/PanchangaSummaryCard.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/cards/PanchangaSummaryCard.tsx): shows the main Panchanga summary fields for a date such as tithi, nakshatra, yoga, and karana.
- [src/components/cards/SunCard.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/cards/SunCard.tsx): shows sunrise, sunset, moonrise, and moonset values when the dataset has them.
- [src/components/cards/WindowCard.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/cards/WindowCard.tsx): displays a named time window such as Rahukalam in a small readable card.
- [src/components/cards/MuhurthaCard.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/cards/MuhurthaCard.tsx): shows one muhurtha entry, including its type and key supporting fields.

## Common UI building blocks

- [src/components/common/ScreenContainer.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/common/ScreenContainer.tsx): a shared page wrapper that applies padding, scrolling, safe area handling, and background color.
- [src/components/common/SectionHeader.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/common/SectionHeader.tsx): renders consistent section titles and subtitles across screens.
- [src/components/common/FilterBar.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/common/FilterBar.tsx): a reusable pill-button row for filters such as special tithi categories.
- [src/components/common/EmptyState.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/common/EmptyState.tsx): the standard UI shown when there is no data to display.
- [src/components/common/ErrorState.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/common/ErrorState.tsx): the standard UI shown when something fails to load.
- [src/components/common/LoadingState.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/common/LoadingState.tsx): the standard loading panel used while async data is still being fetched.
- [src/components/common/PrimaryTextLink.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/common/PrimaryTextLink.tsx): a small text-first navigation link used for lightweight call-to-action moments.
- [src/components/common/SearchHeaderButton.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/common/SearchHeaderButton.tsx): the reusable header button that opens the search screen.

## Day-detail components

- [src/components/day/SpecialTithiList.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/day/SpecialTithiList.tsx): renders special tithis as tappable rows that navigate to the matching day view when possible.
- [src/components/day/TransitionTimeline.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/day/TransitionTimeline.tsx): displays tithi, nakshatra, yoga, and karana transitions in an ordered timeline.

## Settings-specific components

- [src/components/settings/ReminderTimeField.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/settings/ReminderTimeField.tsx): a reminder time picker with hour, minute, and AM/PM controls that stores values in the app's internal `HH:MM` format.
- [src/components/settings/SettingsChipGroup.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components/settings/SettingsChipGroup.tsx): reusable selectable chips used for weekdays, lead-day choices, and special tithi type selection.

## Database layer

- [src/db/client.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/db/client.ts): opens and caches the Expo SQLite database connection so the rest of the app can reuse it safely.
- [src/db/schema.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/db/schema.ts): stores the SQL schema as a JavaScript string so the app can initialize the local database on device startup.
- [src/db/seed.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/db/seed.ts): exposes the bundled JSON seed in a TypeScript-friendly way so bootstrap code can insert it into SQLite.
- [src/db/bootstrap.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/db/bootstrap.ts): creates tables, checks the seed version, and reseeds the local database when the bundled data changes.

## Repository layer

- [src/db/repositories/panchanga-repository.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/db/repositories/panchanga-repository.ts): the main data-access layer. It contains typed SQL queries for locations, month summaries, day details, special tithis, muhurthas, and upcoming special tithis.
- [src/db/repositories/search-repository.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/db/repositories/search-repository.ts): focused search queries that turn raw SQL results into app-level search results.

## Domain helpers

- [src/domain/dates/index.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/domain/dates/index.ts): date utilities used throughout the app, including month bounds, date formatting, Monday-first calendar math, and timezone-aware "today".
- [src/domain/panchanga/labels.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/domain/panchanga/labels.ts): human-readable labels for category values stored in the database or settings state.

## Hooks

- [src/hooks/useAppBootstrap.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/hooks/useAppBootstrap.ts): starts database initialization when the app launches and reports whether startup has finished.
- [src/hooks/usePanchangaQueries.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/hooks/usePanchangaQueries.ts): React Query wrappers around repository methods so screens can fetch typed data with caching.
- [src/hooks/useSelectedLocation.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/hooks/useSelectedLocation.ts): combines location settings and database queries to produce the currently active location in one place.

## Services

- [src/services/reminders.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/services/reminders.ts): the reminder engine. It handles notification permissions, Android notification channel setup, schedule generation, and mapping reminder settings to real Panchanga dates.

## State, theme, and types

- [src/store/settings-store.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/store/settings-store.ts): the persisted Zustand store for user preferences such as theme, location, and reminder settings. It also includes migration logic for older saved settings.
- [src/theme/tokens.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/theme/tokens.ts): raw design tokens like colors, spacing, radii, and font choices for light and dark mode.
- [src/theme/index.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/theme/index.ts): the runtime theme system, including the React context and helper functions that turn tokens into a usable app theme.
- [src/types/domain.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/types/domain.ts): the central type definitions for locations, days, special tithis, reminders, search results, and other domain concepts.
- [src/types/navigation.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/types/navigation.ts): small typed route helpers so screens navigate with valid parameter shapes.

## Data handoff

- The raw import pipeline no longer lives in this app repo. Generated seed data is expected to come from the separate `ram-panchanga-data` repo and be copied into `data/generated/panchanga-seed.json` before release.

## How to read the project in order

1. Start with [README.md](/E:/Source/UMPanchangaPST/UMPanchangaPST/README.md) for setup and purpose.
2. Read [app/_layout.tsx](/E:/Source/UMPanchangaPST/UMPanchangaPST/app/_layout.tsx) to understand the app shell.
3. Read [src/types/domain.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/types/domain.ts) to learn the main data shapes.
4. Read [src/db/repositories/panchanga-repository.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/db/repositories/panchanga-repository.ts) to see how the app reads data.
5. Read [src/hooks/usePanchangaQueries.ts](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/hooks/usePanchangaQueries.ts) to see how screens consume that data.
6. Finally, read the files under [app](/E:/Source/UMPanchangaPST/UMPanchangaPST/app) and [src/components](/E:/Source/UMPanchangaPST/UMPanchangaPST/src/components) to understand the UI.
