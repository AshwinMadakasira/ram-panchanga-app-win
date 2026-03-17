/*
 * Teaching note:
 * The app stores compact category codes in data and state, but UI components need human-friendly
 * labels. This file centralizes that translation.
 */
import type { AppLanguage, MuhurthaType, SpecialTithiCategory } from "@/types/domain";

/** Human-friendly labels for special-tithi category codes used in the app. */
export const specialTithiCategoryLabels: Record<SpecialTithiCategory, string> = {
  all: "All",
  festival: "Festival",
  vrata: "Vrata",
  ekadashi: "Ekadashi",
  pournami: "Pournami",
  punyadina: "Punyadina",
  sankramana: "Sankramana"
};

const specialTithiCategoryLabelsKannada: Record<SpecialTithiCategory, string> = {
  all: "ಎಲ್ಲಾ",
  festival: "ಹಬ್ಬ",
  vrata: "ವ್ರತ",
  ekadashi: "ಏಕಾದಶಿ",
  pournami: "ಪೌರ್ಣಮಿ",
  punyadina: "ಪುಣ್ಯದಿನ",
  sankramana: "ಸಂಕ್ರಮಣ"
};

/** Human-friendly labels for muhurtha filter values. */
export const muhurthaTypeLabels: Record<MuhurthaType, string> = {
  all: "All",
  vivaha: "Vivaha",
  upanayana: "Upanayana",
  vastu: "Vastu"
};

const muhurthaTypeLabelsKannada: Record<MuhurthaType, string> = {
  all: "ಎಲ್ಲಾ",
  vivaha: "ವಿವಾಹ",
  upanayana: "ಉಪನಯನ",
  vastu: "ವಾಸ್ತು"
};

/** Return category labels in the selected app language. */
export const getSpecialTithiCategoryLabels = (language: AppLanguage) =>
  language === "kn" ? specialTithiCategoryLabelsKannada : specialTithiCategoryLabels;

/** Return muhurtha-type labels in the selected app language. */
export const getMuhurthaTypeLabels = (language: AppLanguage) =>
  language === "kn" ? muhurthaTypeLabelsKannada : muhurthaTypeLabels;
