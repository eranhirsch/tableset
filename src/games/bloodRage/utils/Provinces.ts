import { ColorId } from "app/utils/Colors";
import avro from "avsc";
import { $, C, Dict, Vec } from "common";

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

interface Province {
  name: string;
  color: ColorId;
  /**
   * Going from the top left column and going clockwise around the board from 0
   * to 7.
   */
  position: number;
}
const PROVINCES: Readonly<Required<Record<ProvinceId, Province>>> = {
  /* Spell-checker: disable */
  angerboda: { name: "Angerboda", color: "yellow", position: 2 },
  anolang: { name: "Anolang", color: "white", position: 6 },
  eluagar: { name: "Eluagar", color: "yellow", position: 1 },
  gimle: { name: "Gimle", color: "white", position: 7 },
  horgr: { name: "Horgr", color: "blue", position: 4 },
  muspelheim: { name: "Muspelheim", color: "blue", position: 3 },
  myrkulor: { name: "Myrkulor", color: "yellow", position: 0 },
  utgard: { name: "Utgard", color: "blue", position: 5 },
  /* Spell-checker: enable */
};

export const Provinces = {
  ids: ALL_PROVINCE_IDS,
  atPosition: (pos: number) =>
    $(
      PROVINCES,
      ($$) => Dict.filter($$, ({ position }) => pos === position),
      Vec.keys,
      C.onlyx
    ),
  label: (pid: ProvinceId) => PROVINCES[pid].name,
  color: (pid: ProvinceId) => PROVINCES[pid].color,
  position: (pid: ProvinceId) => PROVINCES[pid].position,
  avroType: (name: string): avro.schema.DefinedType => ({
    type: "enum",
    name: name,
    symbols: [...ALL_PROVINCE_IDS],
  }),
} as const;
