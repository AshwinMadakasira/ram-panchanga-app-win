import assert from "node:assert/strict";

import seedChicago from "../data/generated/panchanga-seed-chicago-cst.json";
import seedNewYork from "../data/generated/panchanga-seed-newyork-est.json";
import seedVancouver from "../data/generated/panchanga-seed-vancouver-pst.json";
import { addMonths, getCalendarWeeks, getMonthBounds } from "../src/domain/dates";

const vancouverSeed = seedVancouver as any;
const chicagoSeed = seedChicago as any;
const newYorkSeed = seedNewYork as any;
const seeds = [vancouverSeed, chicagoSeed, newYorkSeed];
const combinedSeed = {
  locations: seeds.flatMap((seed) => seed.locations),
  calendarDays: seeds.flatMap((seed) => seed.calendarDays),
  transitions: seeds.flatMap((seed) => seed.transitions),
  specialTithis: seeds.flatMap((seed) => seed.specialTithis),
  ekadashis: seeds.flatMap((seed) => seed.ekadashis),
  punyadinas: seeds.flatMap((seed) => seed.punyadinas),
  timeWindows: seeds.flatMap((seed) => seed.timeWindows),
  muhurthas: seeds.flatMap((seed) => seed.muhurthas)
};

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

runCase("all three location seeds contain calendar data", () => {
  assert.deepEqual(
    combinedSeed.locations.map((location) => location.id).sort(),
    ["chicago-cst", "newyork-est", "vancouver-pst"]
  );
  seeds.forEach((seed) => {
    assert.equal(seed.locations.length, 1);
    assert.ok(seed.calendarDays.length > 300);
  });
});

runCase("combined seed has no dangling foreign keys", () => {
  const locationIds = new Set(combinedSeed.locations.map((location) => location.id));
  const calendarDayIds = new Set(combinedSeed.calendarDays.map((day) => day.id));

  combinedSeed.calendarDays.forEach((day) => assert.ok(locationIds.has(day.locationId), `missing location for ${day.id}`));
  combinedSeed.transitions.forEach((transition) =>
    assert.ok(calendarDayIds.has(transition.calendarDayId), `missing day for ${transition.id}`)
  );
  combinedSeed.specialTithis.forEach((specialTithi) =>
    assert.ok(calendarDayIds.has(specialTithi.calendarDayId), `missing day for ${specialTithi.id}`)
  );
  combinedSeed.ekadashis.forEach((ekadashi) => {
    assert.ok(calendarDayIds.has(ekadashi.calendarDayId), `missing day for ${ekadashi.id}`);
    assert.ok(locationIds.has(ekadashi.locationId), `missing location for ${ekadashi.id}`);
  });
  combinedSeed.punyadinas.forEach((punyadina) => {
    assert.ok(calendarDayIds.has(punyadina.calendarDayId), `missing day for ${punyadina.id}`);
    assert.ok(locationIds.has(punyadina.locationId), `missing location for ${punyadina.id}`);
  });
  combinedSeed.timeWindows.forEach((timeWindow) =>
    assert.ok(calendarDayIds.has(timeWindow.calendarDayId), `missing day for ${timeWindow.id}`)
  );
  combinedSeed.muhurthas.forEach((muhurtha) =>
    assert.ok(locationIds.has(muhurtha.locationId), `missing location for ${muhurtha.id}`)
  );
});

runCase("Vancouver July 4 correction remains applied", () => {
  const day = vancouverSeed.calendarDays.find((entry: any) => entry.id === "vancouver-pst-2026-07-04");
  assert.ok(day);
  assert.equal(day.specialTithiRawText, null);
  assert.equal(vancouverSeed.specialTithis.some((entry: any) => entry.calendarDayId === day.id), false);
  assert.equal(vancouverSeed.ekadashis.some((entry: any) => entry.calendarDayId === day.id), false);
});

runCase("Vancouver has astronomical windows", () => {
  const day = vancouverSeed.calendarDays.find((entry: any) => entry.id === "vancouver-pst-2026-03-20");
  assert.ok(day);
  const dayWindows = vancouverSeed.timeWindows.filter((entry: any) => entry.calendarDayId === day.id);
  const windowTypes = dayWindows.map((entry: any) => entry.type);

  assert.deepEqual(windowTypes.slice(-3), ["braahmi-kaala", "morning-sandhya", "evening-sandhya"]);
  assert.ok(day.sunrise);
  assert.ok(day.sunset);
});

runCase("Chicago and New York omit astronomy data", () => {
  const chicagoDay = chicagoSeed.calendarDays.find((entry: any) => entry.id === "chicago-cst-2026-03-20");
  const newYorkDay = newYorkSeed.calendarDays.find((entry: any) => entry.id === "newyork-est-2026-03-20");
  assert.ok(chicagoDay);
  assert.ok(newYorkDay);
  assert.equal(chicagoDay.sunrise, null);
  assert.equal(chicagoDay.sunset, null);
  assert.equal(newYorkDay.sunrise, null);
  assert.equal(newYorkDay.sunset, null);
});

runCase("Vancouver shifted source rows are repaired in the seed", () => {
  const day = vancouverSeed.calendarDays.find((entry: any) => entry.id === "vancouver-pst-2026-04-13");
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
