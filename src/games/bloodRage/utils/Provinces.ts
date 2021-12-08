import { GamePiecesColor } from "model/GamePiecesColor";

const ALL_PROVINCE_IDS = [
  /* Spell-checker: disable */
  "angerboda",
  "anolang",
  "eluagar",
  "gimle",
  "horgr",
  "muspelheim",
  "myrkulor",
  "utgard",
  /* Spell-checker: enable */
] as const;
export type ProvinceId = typeof ALL_PROVINCE_IDS[number];

export const Provinces = {
  ids: ALL_PROVINCE_IDS,
  label,
  color,
} as const;

function label(provinceId: ProvinceId): string {
  switch (provinceId) {
    /* Spell-checker: disable */
    case "angerboda":
      return "Angerboda";
    case "anolang":
      return "Anolang";
    case "eluagar":
      return "Eluagar";
    case "gimle":
      return "Gimle";
    case "horgr":
      return "Horgr";
    case "muspelheim":
      return "Muspelheim";
    case "myrkulor":
      return "Myrkulor";
    case "utgard":
      return "Utgard";
    /* Spell-checker: enable */
  }
}

function color(provinceId: ProvinceId): GamePiecesColor {
  switch (provinceId) {
    /* Spell-checker: disable */
    case "angerboda":
      return "yellow";
    case "anolang":
      return "white";
    case "eluagar":
      return "yellow";
    case "gimle":
      return "white";
    case "horgr":
      return "blue";
    case "muspelheim":
      return "blue";
    case "myrkulor":
      return "yellow";
    case "utgard":
      return "blue";
    /* Spell-checker: enable */
  }
}
