/*
 * Teaching note:
 * The app stores compact category codes in data and state, but UI components need human-friendly
 * labels. This file centralizes that translation.
 */
import type { MuhurthaType, SpecialTithiCategory } from "@/types/domain";

/** Human-friendly labels for special-tithi category codes used in the app. */
export const specialTithiCategoryLabels: Record<SpecialTithiCategory, string> = {
  all: "All",
  festival: "Festival",
  vrata: "Vrata",
  ekadashi: "Ekadashi",
  punyadina: "Punyadina",
  sankramana: "Sankramana"
};

/** Human-friendly labels for muhurtha filter values. */
export const muhurthaTypeLabels: Record<MuhurthaType, string> = {
  all: "All",
  vivaha: "Vivaha",
  upanayana: "Upanayana",
  vastu: "Vastu"
};
