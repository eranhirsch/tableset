import { ColorId } from "app/utils/Colors";
import avro from "avsc";

const ALL_GOD_IDS = [
  "heimdall",
  "loki",
  "frigga",
  "tyr",
  "thor",
  "odin",
] as const;
export type GodId = typeof ALL_GOD_IDS[number];

const AVRO_TYPE: avro.schema.DefinedType = {
  type: "enum",
  name: "GodId",
  symbols: [...ALL_GOD_IDS],
};

const PER_GAME = 2;

export const Gods = {
  PER_GAME,
  ids: ALL_GOD_IDS,
  label,
  color,
  isType: (x: unknown): x is GodId =>
    typeof x === "string" && ALL_GOD_IDS.includes(x as GodId),
  avroType: AVRO_TYPE,
} as const;

function label(godId: GodId): string {
  switch (godId) {
    case "frigga":
      return "Frigga";
    case "heimdall":
      return "Heimdall";
    case "loki":
      return "Loki";
    case "odin":
      return "Odin";
    case "thor":
      return "Thor";
    case "tyr":
      return "Tyr";
  }
}

function color(godId: GodId): ColorId {
  switch (godId) {
    case "frigga":
      return "purple";
    case "heimdall":
      return "orange";
    case "loki":
      return "black";
    case "odin":
      return "white";
    case "thor":
      return "blue";
    case "tyr":
      return "red";
  }
}
