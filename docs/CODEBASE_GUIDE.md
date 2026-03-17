# App Codebase Guide

This guide explains the important handwritten files in the frontend repo.

Generated files, lockfiles, fonts, images, and copied seed data are not the main focus here.

## Root and config files

- [README.md](../README.md)
  Main project introduction and run instructions
- [app.json](../app.json)
  Expo app metadata and platform config
- [package.json](../package.json)
  Scripts and dependencies
- [babel.config.js](../babel.config.js)
  Babel config for Expo and NativeWind
- [metro.config.js](../metro.config.js)
  Metro bundler config
- [eslint.config.js](../eslint.config.js)
  Lint configuration
- [tailwind.config.js](../tailwind.config.js)
  NativeWind/Tailwind config
- [tsconfig.json](../tsconfig.json)
  TypeScript compiler options

## Route layer

- [app/_layout.tsx](../app/_layout.tsx)
  Root providers, startup flow, and stack navigation
- [app/(tabs)/_layout.tsx](../app/(tabs)/_layout.tsx)
  Bottom-tab navigation
- [app/(tabs)/index.tsx](../app/(tabs)/index.tsx)
  Today screen
- [app/(tabs)/calendar.tsx](../app/(tabs)/calendar.tsx)
  Month calendar screen
- [app/(tabs)/special-tithis.tsx](../app/(tabs)/special-tithis.tsx)
  Curated special-tithi browser
- [app/(tabs)/settings.tsx](../app/(tabs)/settings.tsx)
  Theme, location, and reminder settings
- [app/(tabs)/day/[date].tsx](../app/(tabs)/day/[date].tsx)
  Full day-detail screen
- [app/search.tsx](../app/search.tsx)
  Search screen
- [app/+not-found.tsx](../app/+not-found.tsx)
  Fallback route

## Components

### App coordination

- [src/components/app/ReminderCoordinator.tsx](../src/components/app/ReminderCoordinator.tsx)

### Calendar

- [src/components/calendar/MonthGrid.tsx](../src/components/calendar/MonthGrid.tsx)
- [src/components/calendar/CalendarDayCell.tsx](../src/components/calendar/CalendarDayCell.tsx)

### Cards

- [src/components/cards/DateHero.tsx](../src/components/cards/DateHero.tsx)
- [src/components/cards/PanchangaSummaryCard.tsx](../src/components/cards/PanchangaSummaryCard.tsx)
- [src/components/cards/SunCard.tsx](../src/components/cards/SunCard.tsx)
- [src/components/cards/WindowCard.tsx](../src/components/cards/WindowCard.tsx)
- [src/components/cards/MuhurthaCard.tsx](../src/components/cards/MuhurthaCard.tsx)

### Common UI

- [src/components/common/ScreenContainer.tsx](../src/components/common/ScreenContainer.tsx)
  Shared safe-area wrapper, year banner, and in-screen top header row
- [src/components/common/SectionHeader.tsx](../src/components/common/SectionHeader.tsx)
- [src/components/common/FilterBar.tsx](../src/components/common/FilterBar.tsx)
- [src/components/common/EmptyState.tsx](../src/components/common/EmptyState.tsx)
- [src/components/common/ErrorState.tsx](../src/components/common/ErrorState.tsx)
- [src/components/common/LoadingState.tsx](../src/components/common/LoadingState.tsx)
- [src/components/common/PrimaryTextLink.tsx](../src/components/common/PrimaryTextLink.tsx)

### Day and special-tithi views

- [src/components/day/SpecialTithiList.tsx](../src/components/day/SpecialTithiList.tsx)
- [src/components/day/TransitionTimeline.tsx](../src/components/day/TransitionTimeline.tsx)
- [src/components/special-tithis/SpecialTithiCollection.tsx](../src/components/special-tithis/SpecialTithiCollection.tsx)

### Settings controls

- [src/components/settings/ReminderTimeField.tsx](../src/components/settings/ReminderTimeField.tsx)
- [src/components/settings/SettingsChipGroup.tsx](../src/components/settings/SettingsChipGroup.tsx)

## Data and logic layers

- [src/db/client.ts](../src/db/client.ts)
  Shared SQLite connection
- [src/db/schema.ts](../src/db/schema.ts)
  Runtime schema string
- [src/db/seed.ts](../src/db/seed.ts)
  Combined bundled seed
- [src/db/bootstrap.ts](../src/db/bootstrap.ts)
  Database init and reseed logic
- [src/db/repositories/panchanga-repository.ts](../src/db/repositories/panchanga-repository.ts)
  Main query layer
- [src/db/repositories/search-repository.ts](../src/db/repositories/search-repository.ts)
  Search-specific queries
- [src/domain/dates/index.ts](../src/domain/dates/index.ts)
  Date and timezone helpers
- [src/domain/panchanga/labels.ts](../src/domain/panchanga/labels.ts)
  Display labels for category codes such as `Ekadashi`, `Pournami`, and `Punyadina`
- [src/hooks/useAppBootstrap.ts](../src/hooks/useAppBootstrap.ts)
  Startup hook
- [src/hooks/usePanchangaQueries.ts](../src/hooks/usePanchangaQueries.ts)
  React Query wrappers
- [src/hooks/useSelectedLocation.ts](../src/hooks/useSelectedLocation.ts)
  Active-location helper
- [src/i18n/index.ts](../src/i18n/index.ts)
  Shared static and dynamic localization layer
- [src/services/reminders.ts](../src/services/reminders.ts)
  Notification scheduling logic
- [src/store/settings-store.ts](../src/store/settings-store.ts)
  Persisted settings store, including language, theme, location, and reminder preferences
- [src/theme/tokens.ts](../src/theme/tokens.ts)
  Design tokens, including the current Azure Paper light theme
- [src/theme/index.ts](../src/theme/index.ts)
  Runtime theme system
- [src/types/domain.ts](../src/types/domain.ts)
  Shared data types
- [src/types/navigation.ts](../src/types/navigation.ts)
  Route helpers

## Best read order

1. [README.md](../README.md)
2. [docs/FRONTEND_TEACHING_GUIDE.md](./FRONTEND_TEACHING_GUIDE.md)
3. [docs/ARCHITECTURE.md](./ARCHITECTURE.md)
4. [app/_layout.tsx](../app/_layout.tsx)
5. [src/types/domain.ts](../src/types/domain.ts)
6. [src/db/repositories/panchanga-repository.ts](../src/db/repositories/panchanga-repository.ts)
