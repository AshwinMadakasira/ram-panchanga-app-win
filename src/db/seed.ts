import seedChicago from "../../data/generated/panchanga-seed-chicago-cst.json";
import seedNewYork from "../../data/generated/panchanga-seed-newyork-est.json";
import seedVancouver from "../../data/generated/panchanga-seed-vancouver-pst.json";
import type { SeedBundle } from "@/types/domain";

const sourceSeeds = [seedVancouver, seedChicago, seedNewYork] as SeedBundle[];

export const bundledSeed: SeedBundle = {
  dataVersion: sourceSeeds.map((seed) => seed.dataVersion).join("|"),
  importedAt: null,
  sourceFingerprint: sourceSeeds.map((seed) => seed.sourceFingerprint).filter(Boolean).join("|") || null,
  locations: sourceSeeds.flatMap((seed) => seed.locations),
  calendarDays: sourceSeeds.flatMap((seed) => seed.calendarDays),
  transitions: sourceSeeds.flatMap((seed) => seed.transitions),
  specialTithis: sourceSeeds.flatMap((seed) => seed.specialTithis),
  ekadashis: sourceSeeds.flatMap((seed) => seed.ekadashis),
  punyadinas: sourceSeeds.flatMap((seed) => seed.punyadinas),
  timeWindows: sourceSeeds.flatMap((seed) => seed.timeWindows),
  muhurthas: sourceSeeds.flatMap((seed) => seed.muhurthas)
};
