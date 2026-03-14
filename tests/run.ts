import assert from "node:assert/strict";

import seed from "../data/generated/panchanga-seed.json";
import { addMonths, getCalendarWeeks, getMonthBounds } from "../src/domain/dates";

let failures = 0;

const runCase = (name: string, fn: () => void) => {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${name}`);
    console.error(error);
  }
};

runCase("getMonthBounds returns UTC month range", () => {
  assert.deepEqual(getMonthBounds(2026, 3), {
    start: "2026-03-01",
    end: "2026-03-31"
  });
});

runCase("addMonths rolls over year boundaries", () => {
  assert.deepEqual(addMonths(2026, 12, 1), { year: 2027, month: 1 });
  assert.deepEqual(addMonths(2026, 1, -1), { year: 2025, month: 12 });
});

runCase("getCalendarWeeks uses Monday as the first weekday", () => {
  const weeks = getCalendarWeeks(2026, 3, [
    { date: "2026-03-01" },
    { date: "2026-03-02" },
    { date: "2026-03-31" }
  ]);

  assert.equal(weeks[0][0], null);
  assert.equal(weeks[0][6]?.date, "2026-03-01");
  assert.equal(weeks[1][0]?.date, "2026-03-02");
});

runCase("seed is Vancouver-only and contains calendar data", () => {
  assert.equal(seed.locations.length, 1);
  assert.equal(seed.locations[0]?.id, "vancouver-bc");
  assert.ok(seed.calendarDays.length > 300);
});

runCase("seed has no dangling foreign keys", () => {
  const locationIds = new Set(seed.locations.map((location) => location.id));
  const calendarDayIds = new Set(seed.calendarDays.map((day) => day.id));

  seed.calendarDays.forEach((day) => assert.ok(locationIds.has(day.locationId), `missing location for ${day.id}`));
  seed.transitions.forEach((transition) =>
    assert.ok(calendarDayIds.has(transition.calendarDayId), `missing day for ${transition.id}`)
  );
  seed.specialTithis.forEach((specialTithi) =>
    assert.ok(calendarDayIds.has(specialTithi.calendarDayId), `missing day for ${specialTithi.id}`)
  );
  seed.ekadashis.forEach((ekadashi) => {
    assert.ok(calendarDayIds.has(ekadashi.calendarDayId), `missing day for ${ekadashi.id}`);
    assert.ok(locationIds.has(ekadashi.locationId), `missing location for ${ekadashi.id}`);
  });
  seed.punyadinas.forEach((punyadina) => {
    assert.ok(calendarDayIds.has(punyadina.calendarDayId), `missing day for ${punyadina.id}`);
    assert.ok(locationIds.has(punyadina.locationId), `missing location for ${punyadina.id}`);
  });
  seed.timeWindows.forEach((timeWindow) =>
    assert.ok(calendarDayIds.has(timeWindow.calendarDayId), `missing day for ${timeWindow.id}`)
  );
  seed.muhurthas.forEach((muhurtha) =>
    assert.ok(locationIds.has(muhurtha.locationId), `missing location for ${muhurtha.id}`)
  );
});

runCase("July 4 correction remains applied", () => {
  const day = seed.calendarDays.find((entry) => entry.id === "vancouver-bc-2026-07-04");
  assert.ok(day);
  assert.equal(day.specialTithiRawText, null);
  assert.equal(seed.specialTithis.some((entry) => entry.calendarDayId === day.id), false);
  assert.equal(seed.ekadashis.some((entry) => entry.calendarDayId === day.id), false);
});

runCase("astronomical windows exist when sunrise and sunset are present", () => {
  const day = seed.calendarDays.find((entry) => entry.id === "vancouver-bc-2026-03-20");
  assert.ok(day);
  const dayWindows = seed.timeWindows.filter((entry) => entry.calendarDayId === day.id);
  const windowTypes = dayWindows.map((entry) => entry.type);

  assert.deepEqual(windowTypes.slice(-3), ["braahmi-kaala", "morning-sandhya", "evening-sandhya"]);
});

runCase("shifted source rows are repaired in the seed", () => {
  const day = seed.calendarDays.find((entry) => entry.id === "vancouver-bc-2026-04-13");
  assert.ok(day);
  assert.equal(day.primaryTithiAtSunrise, "Ekadashi 9:25");
  assert.equal(day.primaryNakshatraAtSunrise, "Shatabhisha 25:21 +");
  assert.equal(day.primaryYogaAtSunrise, "Shukla 25:12");
  assert.equal(day.primaryKaranaAtSunrise, "Balava 9:25");
});

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log("All tests passed.");
}
