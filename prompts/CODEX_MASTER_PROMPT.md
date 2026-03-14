You are building a production-oriented Expo + React Native + TypeScript app called `Panchanga`.

Read these files first and follow them strictly:
- docs/PRODUCT_REQUIREMENTS.md
- docs/ARCHITECTURE.md
- docs/SCREEN_SPECS.md
- docs/BUILD_PLAN.md
- api/openapi.yaml
- data/schema.sql
- data/seed_notes.md
- tasks/IMPLEMENTATION_BACKLOG.md

Your job:
1. Scaffold the app.
2. Implement the SQLite database layer.
3. Create data import scripts from the extracted Panchanga dataset.
4. Build the screens in this order:
   - home/today
   - month calendar
   - day detail
   - special tithis
   - muhurthas
   - settings
   - search
5. Use an elegant, clean, warm visual design.
6. Keep the architecture modular and maintainable.

Hard requirements:
- TypeScript everywhere
- Expo Router
- Reusable components
- no inline giant components
- repository/query layer for data access
- offline-first behavior
- strong typing for route params and domain models
- no placeholder lorem ipsum
- no fake/mock Panchanga values once import is wired
- if data is missing, show graceful empty states

Implementation rules:
- Prefer simple, explicit code over over-engineered abstractions.
- Add TODO markers only where external assets or manual credentials are required.
- Include clear setup instructions in the root README.
- Make the app runnable with `npm install` then `npx expo start`.

Deliverables:
- complete project scaffold
- import script
- database schema + seed
- screens and components
- polished sample theme
- working navigation
- runnable local app
