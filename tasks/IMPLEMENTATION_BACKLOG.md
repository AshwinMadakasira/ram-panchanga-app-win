# Implementation Backlog

## Done
- [x] Expo app scaffold with TypeScript, Expo Router, NativeWind, Reanimated, SQLite, linting, and modular screen structure
- [x] Local database client, bootstrap, schema rebuild handling, repositories, and query hooks
- [x] Seed/import pipeline for Panchanga source data
- [x] Structured `CalendarDay`, `DayTransition`, `SpecialTithi`, `TimeWindow`, `Muhurtha`, `Location`, `Ekadashi`, and `Punyadina` models
- [x] Screens for Today, Month Calendar, Day Detail, Special Tithis, Search, and Settings
- [x] Reminder scheduling with weekday and upcoming special-tithi support
- [x] Vancouver sunrise, sunset, moonrise, and moonset import
- [x] Derived `braahmi-kaala`, `morning-sandhya`, and `evening-sandhya` time windows
- [x] Root README, release guide, and seeded local dataset
- [x] Initial automated test coverage for date utilities, importer helpers, and seed integrity

## Remaining
- [ ] Add focused repository query tests against a disposable SQLite database
- [ ] Add a few screen-level smoke tests for the highest-traffic routes
- [ ] Add final store assets: icon, splash, adaptive icon
- [ ] Complete Apple / Google release account setup and submission metadata
- [ ] Decide whether Muhurtha should remain hidden or be removed entirely from the codebase

## Deferred
- [ ] Web hosting support with a web-safe data layer
- [ ] Additional reminder polish only if richer schedules or browser/device sync are needed later
