import type { MuhurthaType, SpecialTithiCategory } from "@/types/domain";

export const specialTithiCategoryLabels: Record<SpecialTithiCategory, string> = {
  all: "All",
  festival: "Festival",
  vrata: "Vrata",
  ekadashi: "Ekadashi",
  punyadina: "Punyadina",
  sankramana: "Sankramana"
};

export const muhurthaTypeLabels: Record<MuhurthaType, string> = {
  all: "All",
  vivaha: "Vivaha",
  upanayana: "Upanayana",
  vastu: "Vastu"
};
