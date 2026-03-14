import { getDatabase } from "@/db/client";
import type { SearchResult } from "@/types/domain";

type CalendarSearchRow = {
  id: string;
  date: string;
  primary_tithi_at_sunrise: string | null;
  primary_nakshatra_at_sunrise: string | null;
};

type SpecialTithiSearchRow = {
  id: string;
  name: string;
  category: string | null;
  date: string;
};

type MuhurthaSearchRow = {
  id: string;
  type: string;
  date: string;
  tithi: string | null;
  nakshatra: string | null;
};

export const searchRepository = {
  async search(query: string, locationId: string): Promise<SearchResult[]> {
    const term = `%${query.trim()}%`;
    if (term === "%%") {
      return [];
    }

    const db = await getDatabase();
    const [days, specialTithis, muhurthas] = await Promise.all([
      db.getAllAsync<CalendarSearchRow>(
        `SELECT id, date, primary_tithi_at_sunrise, primary_nakshatra_at_sunrise
         FROM calendar_day
         WHERE location_id = ? AND (
           date LIKE ? OR
           primary_tithi_at_sunrise LIKE ? OR
           primary_nakshatra_at_sunrise LIKE ?
         )
         ORDER BY date ASC
         LIMIT 12`,
        [locationId, term, term, term]
      ),
      db.getAllAsync<SpecialTithiSearchRow>(
        `SELECT st.id, st.name, st.category, cd.date
         FROM special_tithi st
         JOIN calendar_day cd ON cd.id = st.calendar_day_id
         WHERE cd.location_id = ? AND st.name LIKE ?
         ORDER BY cd.date ASC
         LIMIT 12`,
        [locationId, term]
      ),
      db.getAllAsync<MuhurthaSearchRow>(
        `SELECT id, type, date, tithi, nakshatra
         FROM muhurtha
         WHERE location_id = ? AND (type LIKE ? OR tithi LIKE ? OR nakshatra LIKE ?)
         ORDER BY date ASC
         LIMIT 12`,
        [locationId, term, term, term]
      )
    ]);

    return [
      ...days.map(
        (day): SearchResult => ({
          id: day.id,
          kind: "date",
          title: day.date,
          subtitle: [day.primary_tithi_at_sunrise, day.primary_nakshatra_at_sunrise].filter(Boolean).join(" | "),
          date: day.date
        })
      ),
      ...specialTithis.map(
        (specialTithi): SearchResult => ({
          id: specialTithi.id,
          kind: "special_tithi",
          title: specialTithi.name,
          subtitle: [specialTithi.category, specialTithi.date].filter(Boolean).join(" | "),
          date: specialTithi.date
        })
      ),
      ...muhurthas.map(
        (muhurtha): SearchResult => ({
          id: muhurtha.id,
          kind: "muhurtha",
          title: `${muhurtha.type} muhurtha`,
          subtitle: [muhurtha.date, muhurtha.tithi, muhurtha.nakshatra].filter(Boolean).join(" | "),
          date: muhurtha.date
        })
      )
    ].slice(0, 24);
  }
};
