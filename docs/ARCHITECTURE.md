# Architecture

## Chosen stack
- Expo + React Native + TypeScript
- Expo Router for navigation
- SQLite for local database
- Zustand for client state
- TanStack Query for async data abstraction
- NativeWind for styling
- Reanimated for transitions

## Why this stack
- Single codebase for Android + iOS
- Fast developer iteration
- Clean store deployment path
- Best fit for an offline-first data-heavy app

## Layers

### 1. App / presentation
- routes
- screens
- components
- themes
- animation
- UI state

### 2. Domain
- Panchanga date logic
- formatting helpers
- search/filter
- calendar transformations
- special tithi grouping

### 3. Data
- SQLite
- repository layer
- import/migrations
- query helpers

## Suggested project structure

```txt
app/
  (tabs)/
    index.tsx
    calendar.tsx
    special-tithis.tsx
    muhurthas.tsx
    settings.tsx
  day/[date].tsx
  search.tsx

src/
  components/
    cards/
    calendar/
    day/
    common/
  db/
    client.ts
    migrations/
    seed.ts
    queries/
  domain/
    panchanga/
    dates/
    special-tithis/
    muhurthas/
  hooks/
  store/
  theme/
  types/
  utils/

assets/
data/
```

## Data access
Use a repository pattern:
- `getMonthSummary(year, month, locationId)`
- `getDayDetails(date, locationId)`
- `getSpecialTithisByRange(startDate, endDate, filters?)`
- `getMuhurthas(eventType?, month?)`

## Offline-first approach
- ship a seeded SQLite DB with the app
- import on first run if DB absent
- expose a future update mechanism through versioned data bundles
