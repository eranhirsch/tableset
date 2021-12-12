import { ColorId } from "app/utils/Colors";
import avro from "avsc";
import { Vec } from "common";
import { BloodRageProductId } from "../steps/productsMetaStep";

const ALL_IDS = ["bear", "ram", "raven", "serpent", "wolf"] as const;
export type ClanId = typeof ALL_IDS[number];

const AVRO_TYPE: avro.schema.DefinedType = {
  type: "enum",
  name: "ClanId",
  symbols: [...ALL_IDS],
};

export const Clans = {
  isClanId: (x: unknown): x is ClanId => ALL_IDS.includes(x as ClanId),
  color,
  label,
  availableForProducts: (productIds: readonly BloodRageProductId[]) =>
    productIds.includes("player5") ? ALL_IDS : Vec.diff(ALL_IDS, ["ram"]),
  avroType: AVRO_TYPE,
} as const;

function color(clanId: ClanId): ColorId {
  switch (clanId) {
    case "bear":
      return "brown";
    case "raven":
      return "blue";
    case "serpent":
      return "orange";
    case "wolf":
      return "red";
    case "ram":
      return "green";
  }
}

function label(clanId: ClanId): string {
  switch (clanId) {
    case "bear":
      return "🐻 Bear";
    case "raven":
      return "🐦 Raven";
    case "serpent":
      return "🐍 Serpent";
    case "ram":
      return "🐏 Ram";
    case "wolf":
      return "🐺 Wolf";
  }
}
