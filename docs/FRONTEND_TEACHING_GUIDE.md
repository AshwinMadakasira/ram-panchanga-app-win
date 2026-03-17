# Frontend Teaching Guide

This guide is for teaching a beginner how the `ram-panchanga-app` frontend is organized.

## Big picture

The app follows a layered structure:

1. `app/`
   Route files and screens. These decide which sections appear on each page.
2. `src/components/`
   Reusable UI building blocks. These focus on presentation.
3. `src/hooks/`
   Screen-friendly data and coordination helpers.
4. `src/db/`
   The local SQLite layer. This app is offline-first and ships with bundled seed data.
5. `src/domain/`
   Reusable project logic such as date math and display labels.
6. `src/store/`
   Persisted user settings such as selected location, theme, and reminders.
7. `src/services/`
   Side-effect-heavy logic such as notification scheduling.
8. `src/theme/`
   Colors, spacing, typography, and the runtime theme object.
9. `src/types/`
   Shared TypeScript shapes used across the whole app.

## Design instructions embodied in the frontend

- Offline-first: the app should work from bundled local data, not depend on a live backend.
- Consistent UI primitives: shared cards, headers, empty states, and loading states reduce duplication.
- Location-aware dates: "today" must respect the selected location timezone.
- Simple navigation: primary tasks live in tabs, secondary tasks like search live in stack routes.
- Educational clarity: repository code reads data, hooks expose data, screens render data.
- Warm visual language: the palette and fonts are intentionally more editorial/traditional than generic mobile defaults.

## How to read the language structure

For a high school student, each TypeScript/React file usually has the same shape:

1. Imports
   These tell you which outside tools the file depends on.
   Library imports come first, then app-specific imports.
2. Types
   These describe the shape of data and props.
3. Constants/helpers
   These are small reusable values or functions used by the main component or module.
4. Main exported function
   This is usually the component, hook, or service entry point.
5. Styles
   React Native files often end with a `createStyles` helper or `StyleSheet.create(...)`.

When reading a function, ask:

- What inputs does it accept?
- Does it return UI, data, or a transformed value?
- Does it read external state, like a hook or database?
- Is it pure logic, or does it cause side effects like navigation or notifications?

## Read order for a student

1. `app/_layout.tsx`
2. `src/types/domain.ts`
3. `src/theme/index.ts`
4. `src/store/settings-store.ts`
5. `src/db/bootstrap.ts`
6. `src/db/repositories/panchanga-repository.ts`
7. `src/hooks/usePanchangaQueries.ts`
8. `app/(tabs)/index.tsx`
9. `src/components/**/*`

## About files that do not support inline comments

Some repo files cannot be meaningfully annotated inside the file itself:

- JSON files such as `package.json`, `app.json`, `manifest.json`, and generated seed files
- lockfiles such as `package-lock.json`
- binary assets such as images and fonts

For those files, use this guide:

- `package.json`: project manifest, scripts, and dependencies
- `app.json`: Expo app metadata and platform configuration
- `manifest.json`: web manifest metadata
- `data/generated/*.json`: generated Panchanga seed data copied from the separate data repo
- `assets/*`: brand and runtime assets used by the app

## Key architecture sentence

If the student remembers only one thing, it should be this:

`screen -> hook -> repository -> SQLite -> seed data`, with theme and settings shared across the whole tree.
