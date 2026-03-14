import { getDatabase } from "@/db/client";
import { bundledSeed } from "@/db/seed";
import { appSchemaSql } from "@/db/schema";

const APP_SCHEMA_VERSION = "5";

const setMetaValue = async (key: string, value: string) => {
  const db = await getDatabase();
  await db.runAsync(
    "INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    [key, value]
  );
};

const getMetaValue = async (key: string) => {
  const db = await getDatabase();
  return db.getFirstAsync<{ value: string }>("SELECT value FROM app_meta WHERE key = ?", [key]);
};

const rebuildDatabaseSchema = async () => {
  const db = await getDatabase();
  await db.execAsync("PRAGMA foreign_keys = OFF;");
  await db.execAsync(`
    DROP TABLE IF EXISTS muhurtha;
    DROP TABLE IF EXISTS time_window;
    DROP TABLE IF EXISTS punyadina;
    DROP TABLE IF EXISTS ekadashi;
    DROP TABLE IF EXISTS special_tithi;
    DROP TABLE IF EXISTS day_transition;
    DROP TABLE IF EXISTS calendar_day;
    DROP TABLE IF EXISTS location;
    DROP TABLE IF EXISTS app_meta;
  `);
  await db.execAsync(appSchemaSql);
  await db.execAsync("PRAGMA foreign_keys = ON;");
};

const insertSeedData = async () => {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      DELETE FROM muhurtha;
      DELETE FROM time_window;
      DELETE FROM punyadina;
      DELETE FROM ekadashi;
      DELETE FROM special_tithi;
      DELETE FROM day_transition;
      DELETE FROM calendar_day;
      DELETE FROM location;
    `);

    for (const location of bundledSeed.locations) {
      await db.runAsync(
        `INSERT INTO location (id, name, region, country, timezone, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          location.id,
          location.name,
          location.region,
          location.country,
          location.timezone,
          location.latitude,
          location.longitude
        ]
      );
    }

    for (const day of bundledSeed.calendarDays) {
      await db.runAsync(
        `INSERT INTO calendar_day
         (id, date, location_id, weekday, gregorian_month, gregorian_day, gregorian_year, lunar_month,
          adhika_month_flag, primary_tithi_at_sunrise, primary_nakshatra_at_sunrise, primary_yoga_at_sunrise,
          primary_karana_at_sunrise, sunrise, sunset, moonrise, moonset, special_tithi_raw_text, source_page)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          day.id,
          day.date,
          day.locationId,
          day.weekday,
          day.gregorianMonth,
          day.gregorianDay,
          day.gregorianYear,
          day.lunarMonth,
          day.adhikaMonthFlag ? 1 : 0,
          day.primaryTithiAtSunrise,
          day.primaryNakshatraAtSunrise,
          day.primaryYogaAtSunrise,
          day.primaryKaranaAtSunrise,
          day.sunrise,
          day.sunset,
          day.moonrise,
          day.moonset,
          day.specialTithiRawText,
          day.sourcePage
        ]
      );
    }

    for (const transition of bundledSeed.transitions) {
      await db.runAsync(
        `INSERT INTO day_transition
         (id, calendar_day_id, type, name, starts_at, ends_at, display_order, raw_source_text)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transition.id,
          transition.calendarDayId,
          transition.type,
          transition.name,
          transition.startsAt,
          transition.endsAt,
          transition.displayOrder,
          transition.rawSourceText
        ]
      );
    }

    for (const specialTithi of bundledSeed.specialTithis) {
      await db.runAsync(
        `INSERT INTO special_tithi (id, calendar_day_id, name, category, priority, description, raw_text)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          specialTithi.id,
          specialTithi.calendarDayId,
          specialTithi.name,
          specialTithi.category,
          specialTithi.priority,
          specialTithi.description,
          specialTithi.rawText
        ]
      );
    }

    for (const ekadashi of bundledSeed.ekadashis ?? []) {
      await db.runAsync(
        `INSERT INTO ekadashi (id, calendar_day_id, date, location_id, variant, name, display_name, raw_text)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ekadashi.id,
          ekadashi.calendarDayId,
          ekadashi.date,
          ekadashi.locationId,
          ekadashi.variant,
          ekadashi.name,
          ekadashi.displayName,
          ekadashi.rawText
        ]
      );
    }

    for (const punyadina of bundledSeed.punyadinas ?? []) {
      await db.runAsync(
        `INSERT INTO punyadina (id, calendar_day_id, date, location_id, honoree, details, display_name, raw_text)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          punyadina.id,
          punyadina.calendarDayId,
          punyadina.date,
          punyadina.locationId,
          punyadina.honoree,
          punyadina.details,
          punyadina.displayName,
          punyadina.rawText
        ]
      );
    }

    for (const timeWindow of bundledSeed.timeWindows) {
      await db.runAsync(
        `INSERT INTO time_window (id, calendar_day_id, type, start_time, end_time, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          timeWindow.id,
          timeWindow.calendarDayId,
          timeWindow.type,
          timeWindow.startTime,
          timeWindow.endTime,
          timeWindow.notes
        ]
      );
    }

    for (const muhurtha of bundledSeed.muhurthas) {
      await db.runAsync(
        `INSERT INTO muhurtha
         (id, date, location_id, type, paksha_section, solar_masa, vara, tithi, nakshatra, yoga, lagna, notes, raw_fields)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          muhurtha.id,
          muhurtha.date,
          muhurtha.locationId,
          muhurtha.type,
          muhurtha.pakshaSection,
          muhurtha.solarMasa,
          muhurtha.vara,
          muhurtha.tithi,
          muhurtha.nakshatra,
          muhurtha.yoga,
          muhurtha.lagna,
          muhurtha.notes,
          muhurtha.rawFields
        ]
      );
    }
    await setMetaValue("data_version", bundledSeed.dataVersion);
    await setMetaValue("imported_at", bundledSeed.importedAt ?? "");
    await setMetaValue("seeded_at", new Date().toISOString());
    await setMetaValue("source_fingerprint", bundledSeed.sourceFingerprint ?? "");
    await setMetaValue("schema_version", APP_SCHEMA_VERSION);
  });
};

export const ensureDatabaseReady = async () => {
  const db = await getDatabase();
  await db.execAsync("PRAGMA foreign_keys = ON;");
  await db.execAsync(appSchemaSql);
  const currentSchemaVersion = await getMetaValue("schema_version");
  const currentVersion = await getMetaValue("data_version");

  if (currentSchemaVersion?.value !== APP_SCHEMA_VERSION) {
    await rebuildDatabaseSchema();
    await insertSeedData();
    return;
  }

  if (currentVersion?.value === bundledSeed.dataVersion) {
    return;
  }

  await insertSeedData();
};
