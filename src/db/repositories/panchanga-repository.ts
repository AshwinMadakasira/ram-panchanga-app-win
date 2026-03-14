import { getMonthBounds } from "@/domain/dates";
import { getDatabase } from "@/db/client";
import type {
  CalendarDay,
  DataVersion,
  DayDetails,
  DayTransition,
  Ekadashi,
  Location,
  MonthSummaryDay,
  Muhurtha,
  MuhurthaFilters,
  SpecialTithi,
  SpecialTithiFilters,
  TimeWindow
} from "@/types/domain";

type CalendarDayRow = {
  id: string;
  date: string;
  location_id: string;
  weekday: string;
  gregorian_month: string;
  gregorian_day: number;
  gregorian_year: number;
  lunar_month: string;
  adhika_month_flag: number;
  primary_tithi_at_sunrise: string | null;
  primary_nakshatra_at_sunrise: string | null;
  primary_yoga_at_sunrise: string | null;
  primary_karana_at_sunrise: string | null;
  sunrise: string | null;
  sunset: string | null;
  moonrise: string | null;
  moonset: string | null;
  special_tithi_raw_text: string | null;
  source_page: number | null;
};

type DayTransitionRow = {
  id: string;
  calendar_day_id: string;
  type: DayTransition["type"];
  name: string;
  starts_at: string | null;
  ends_at: string | null;
  display_order: number;
  raw_source_text: string | null;
};

type SpecialTithiRow = {
  id: string;
  calendar_day_id: string;
  name: string;
  category: SpecialTithi["category"];
  priority: number;
  description: string | null;
  raw_text: string | null;
  date?: string;
};

type TimeWindowRow = {
  id: string;
  calendar_day_id: string;
  type: string;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
};

type EkadashiRow = {
  id: string;
  calendar_day_id: string;
  date: string;
  location_id: string;
  variant: Ekadashi["variant"];
  name: string | null;
  display_name: string;
  raw_text: string;
};

type PunyadinaRow = {
  id: string;
  calendar_day_id: string;
  date: string;
  location_id: string;
  honoree: string;
  details: string | null;
  display_name: string;
  raw_text: string;
};

type MuhurthaRow = {
  id: string;
  date: string;
  location_id: string;
  type: Muhurtha["type"];
  paksha_section: string | null;
  solar_masa: string | null;
  vara: string | null;
  tithi: string | null;
  nakshatra: string | null;
  yoga: string | null;
  lagna: string | null;
  notes: string | null;
  raw_fields: string | null;
};

type LocationRow = {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
};

type AppMetaRow = {
  key: string;
  value: string | null;
};

type UpcomingSpecialTithiRow = {
  date: string;
  name: string;
  category: Exclude<SpecialTithi["category"], null>;
};

const mapCalendarDay = (row: CalendarDayRow): CalendarDay => ({
  id: row.id,
  date: row.date,
  locationId: row.location_id,
  weekday: row.weekday,
  gregorianMonth: row.gregorian_month,
  gregorianDay: row.gregorian_day,
  gregorianYear: row.gregorian_year,
  lunarMonth: row.lunar_month,
  adhikaMonthFlag: Boolean(row.adhika_month_flag),
  primaryTithiAtSunrise: row.primary_tithi_at_sunrise,
  primaryNakshatraAtSunrise: row.primary_nakshatra_at_sunrise,
  primaryYogaAtSunrise: row.primary_yoga_at_sunrise,
  primaryKaranaAtSunrise: row.primary_karana_at_sunrise,
  sunrise: row.sunrise,
  sunset: row.sunset,
  moonrise: row.moonrise,
  moonset: row.moonset,
  specialTithiRawText: row.special_tithi_raw_text,
  sourcePage: row.source_page
});

const mapTransition = (row: DayTransitionRow): DayTransition => ({
  id: row.id,
  calendarDayId: row.calendar_day_id,
  type: row.type,
  name: row.name,
  startsAt: row.starts_at,
  endsAt: row.ends_at,
  displayOrder: row.display_order,
  rawSourceText: row.raw_source_text
});

const mapSpecialTithi = (row: SpecialTithiRow): SpecialTithi => ({
  id: row.id,
  calendarDayId: row.calendar_day_id,
  name: row.name,
  category: row.category,
  priority: row.priority,
  description: row.description,
  rawText: row.raw_text,
  date: row.date
});

const mapTimeWindow = (row: TimeWindowRow): TimeWindow => ({
  id: row.id,
  calendarDayId: row.calendar_day_id,
  type: row.type,
  startTime: row.start_time,
  endTime: row.end_time,
  notes: row.notes
});

const mapEkadashiToSpecialTithi = (row: EkadashiRow): SpecialTithi => ({
  id: row.id,
  calendarDayId: row.calendar_day_id,
  name: row.display_name,
  category: "ekadashi",
  priority: 100,
  description: row.variant,
  rawText: row.raw_text,
  date: row.date
});

const mapPunyadinaToSpecialTithi = (row: PunyadinaRow): SpecialTithi => ({
  id: row.id,
  calendarDayId: row.calendar_day_id,
  name: row.display_name,
  category: "punyadina",
  priority: 100,
  description: row.details ? `${row.honoree} ${row.details}` : row.honoree,
  rawText: row.raw_text,
  date: row.date
});

const mapMuhurtha = (row: MuhurthaRow): Muhurtha => ({
  id: row.id,
  date: row.date,
  locationId: row.location_id,
  type: row.type,
  pakshaSection: row.paksha_section,
  solarMasa: row.solar_masa,
  vara: row.vara,
  tithi: row.tithi,
  nakshatra: row.nakshatra,
  yoga: row.yoga,
  lagna: row.lagna,
  notes: row.notes,
  rawFields: row.raw_fields
});

const mapLocation = (row: LocationRow): Location => ({
  id: row.id,
  name: row.name,
  region: row.region,
  country: row.country,
  timezone: row.timezone,
  latitude: row.latitude,
  longitude: row.longitude
});

export const panchangaRepository = {
  async getLocations(): Promise<Location[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<LocationRow>("SELECT * FROM location ORDER BY name ASC");
    return rows.map(mapLocation);
  },

  async getLocationById(locationId: string): Promise<Location | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<LocationRow>("SELECT * FROM location WHERE id = ? LIMIT 1", [locationId]);
    return row ? mapLocation(row) : null;
  },

  async getDataVersion(): Promise<DataVersion> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<AppMetaRow>("SELECT key, value FROM app_meta");
    const meta = new Map(rows.map((row) => [row.key, row.value]));
    return {
      dataVersion: meta.get("data_version") ?? "unknown",
      importedAt: meta.get("imported_at") || null,
      seededAt: meta.get("seeded_at") || null,
      sourceFingerprint: meta.get("source_fingerprint") || null
    };
  },

  async getMonthSummary(year: number, month: number, locationId: string, today: string): Promise<MonthSummaryDay[]> {
    const bounds = getMonthBounds(year, month);
    const db = await getDatabase();
    const days = await db.getAllAsync<CalendarDayRow>(
      `SELECT * FROM calendar_day
       WHERE location_id = ? AND date BETWEEN ? AND ?
       ORDER BY date ASC`,
      [locationId, bounds.start, bounds.end]
    );
    const specialTithis = await db.getAllAsync<Pick<SpecialTithiRow, "id" | "name" | "category"> & { date: string }>(
      `SELECT st.id, st.name, st.category, cd.date
       FROM special_tithi st
       JOIN calendar_day cd ON cd.id = st.calendar_day_id
       WHERE cd.location_id = ? AND cd.date BETWEEN ? AND ?
       ORDER BY st.priority DESC, st.name ASC`,
      [locationId, bounds.start, bounds.end]
    );

    const specialTithiMap = new Map<string, Pick<SpecialTithi, "id" | "name" | "category">[]>();
    specialTithis.forEach((specialTithi) => {
      const current = specialTithiMap.get(specialTithi.date) ?? [];
      if (current.length < 2) {
        current.push({
          id: specialTithi.id,
          name: specialTithi.name,
          category: specialTithi.category
        });
      }
      specialTithiMap.set(specialTithi.date, current);
    });

    return days.map((day) => ({
      ...mapCalendarDay(day),
      specialTithis: specialTithiMap.get(day.date) ?? [],
      isToday: day.date === today
    }));
  },

  async getDayDetails(date: string, locationId: string): Promise<DayDetails | null> {
    const db = await getDatabase();
    const day = await db.getFirstAsync<CalendarDayRow>(
      "SELECT * FROM calendar_day WHERE location_id = ? AND date = ? LIMIT 1",
      [locationId, date]
    );
    if (!day) {
      return null;
    }

    const mappedDay = mapCalendarDay(day);
    const [transitions, specialTithis, timeWindows, muhurthas] = await Promise.all([
      db.getAllAsync<DayTransitionRow>(
        "SELECT * FROM day_transition WHERE calendar_day_id = ? ORDER BY display_order ASC, starts_at ASC",
        [mappedDay.id]
      ),
      db.getAllAsync<SpecialTithiRow>(
        "SELECT * FROM special_tithi WHERE calendar_day_id = ? ORDER BY priority DESC, name ASC",
        [mappedDay.id]
      ),
      db.getAllAsync<TimeWindowRow>("SELECT * FROM time_window WHERE calendar_day_id = ? ORDER BY start_time ASC", [mappedDay.id]),
      db.getAllAsync<MuhurthaRow>("SELECT * FROM muhurtha WHERE location_id = ? AND date = ? ORDER BY type ASC", [
        locationId,
        date
      ])
    ]);

    return {
      day: mappedDay,
      transitions: transitions.map(mapTransition),
      specialTithis: specialTithis.map(mapSpecialTithi),
      timeWindows: timeWindows.map(mapTimeWindow),
      muhurthas: muhurthas.map(mapMuhurtha)
    };
  },

  async getSpecialTithisByRange(locationId: string, filters: SpecialTithiFilters = {}): Promise<SpecialTithi[]> {
    const db = await getDatabase();
    const clauses = ["cd.location_id = ?"];
    const params: (string | number)[] = [locationId];
    const { startDate, endDate, category } = filters;

    if (startDate) {
      clauses.push("cd.date >= ?");
      params.push(startDate);
    }

    if (endDate) {
      clauses.push("cd.date <= ?");
      params.push(endDate);
    }

    if (category === "ekadashi") {
      const ekadashiRows = await db.getAllAsync<EkadashiRow>(
        `SELECT e.*
         FROM ekadashi e
         JOIN calendar_day cd ON cd.id = e.calendar_day_id
         WHERE ${clauses.join(" AND ")}
         ORDER BY e.date ASC, e.display_name ASC`,
        params
      );
      return ekadashiRows.map(mapEkadashiToSpecialTithi);
    }

    if (category === "punyadina") {
      const punyadinaRows = await db.getAllAsync<PunyadinaRow>(
        `SELECT p.*
         FROM punyadina p
         JOIN calendar_day cd ON cd.id = p.calendar_day_id
         WHERE ${clauses.join(" AND ")}
         ORDER BY p.date ASC, p.display_name ASC`,
        params
      );
      return punyadinaRows.map(mapPunyadinaToSpecialTithi);
    }

    if (category && category !== "all") {
      clauses.push("st.category = ?");
      params.push(category);
    }

    const structuredRows = await Promise.all([
      db.getAllAsync<EkadashiRow>(
        `SELECT e.*
         FROM ekadashi e
         JOIN calendar_day cd ON cd.id = e.calendar_day_id
         WHERE ${clauses.join(" AND ")}
         ORDER BY e.date ASC, e.display_name ASC`,
        params
      ),
      db.getAllAsync<PunyadinaRow>(
        `SELECT p.*
         FROM punyadina p
         JOIN calendar_day cd ON cd.id = p.calendar_day_id
         WHERE ${clauses.join(" AND ")}
         ORDER BY p.date ASC, p.display_name ASC`,
        params
      ),
      db.getAllAsync<SpecialTithiRow>(
        `SELECT st.*, cd.date
         FROM special_tithi st
         JOIN calendar_day cd ON cd.id = st.calendar_day_id
         WHERE ${clauses.join(" AND ")} AND st.category NOT IN ('ekadashi', 'punyadina')
         ORDER BY cd.date ASC, st.priority DESC, st.name ASC`,
        params
      )
    ]);

    const curatedRows = [
      ...structuredRows[0].map(mapEkadashiToSpecialTithi),
      ...structuredRows[1].map(mapPunyadinaToSpecialTithi)
    ];

    if (category === "all") {
      return curatedRows.sort((left, right) => {
        if ((left.date ?? "") !== (right.date ?? "")) {
          return (left.date ?? "").localeCompare(right.date ?? "");
        }
        return right.priority - left.priority || left.name.localeCompare(right.name);
      });
    }

    return [
      ...curatedRows,
      ...structuredRows[2].map(mapSpecialTithi)
    ].sort((left, right) => {
      if ((left.date ?? "") !== (right.date ?? "")) {
        return (left.date ?? "").localeCompare(right.date ?? "");
      }
      return right.priority - left.priority || left.name.localeCompare(right.name);
    });
  },

  async getMuhurthas(locationId: string, filters: MuhurthaFilters = {}): Promise<Muhurtha[]> {
    const db = await getDatabase();
    const clauses = ["location_id = ?"];
    const params: (string | number)[] = [locationId];
    const { type, month } = filters;

    if (type && type !== "all") {
      clauses.push("type = ?");
      params.push(type);
    }

    if (month) {
      clauses.push("CAST(substr(date, 6, 2) AS INTEGER) = ?");
      params.push(month);
    }

    const rows = await db.getAllAsync<MuhurthaRow>(
      `SELECT * FROM muhurtha
       WHERE ${clauses.join(" AND ")}
       ORDER BY date ASC, type ASC`,
      params
    );
    return rows.map(mapMuhurtha);
  },

  async getUpcomingSpecialTithis(
    locationId: string,
    category: Exclude<SpecialTithi["category"], null>,
    fromDate: string,
    limit = 8
  ): Promise<UpcomingSpecialTithiRow[]> {
    const db = await getDatabase();
    return db.getAllAsync<UpcomingSpecialTithiRow>(
      `SELECT cd.date, MIN(st.name) AS name, st.category
       FROM special_tithi st
       JOIN calendar_day cd ON cd.id = st.calendar_day_id
       WHERE cd.location_id = ? AND st.category = ? AND cd.date >= ?
       GROUP BY cd.date, st.category
       ORDER BY cd.date ASC
       LIMIT ?`,
      [locationId, category, fromDate, limit]
    );
  }
};
