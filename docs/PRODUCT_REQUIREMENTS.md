# Product Requirements

## Goal
Build a beautiful Panchanga mobile app that works on Android and iOS from a single codebase.

## Primary user journeys
1. Open the app and see today's Panchanga summary.
2. Browse a month grid with Gregorian date + Panchanga indicators.
3. Open any date and see full details:
   - tithi
   - nakshatra
   - yoga
   - karana
   - sunrise/sunset
   - special tithis / festivals / vratas
   - rahukalam and other windows
4. View muhurthas for supported event types.
5. Search festivals, special tithis, tithi, nakshatra.
6. Switch location/timezone in the future without redesigning the app.

## App principles
- Offline first
- Fast local reads
- Minimal clutter
- Elegant typography
- Strong date navigation
- Clear distinction between “summary at sunrise” and “intraday transitions”

## v1 scope
- bundled SQLite database
- month calendar screen
- day detail screen
- special tithi list
- muhurtha list
- settings screen
- basic search
- no login required

## v2 scope
- push notifications
- favorites/reminders
- cloud updates for new years/locations
- widgets
- multilingual support

## Non-goals for v1
- astrology charting
- account sync
- payments/subscriptions
- community features

## Design direction
- ivory / cream background
- saffron / maroon / muted gold accents
- modern card UI
- subtle devotional/temple-inspired separators only
- avoid visual clutter
