import { Vec } from "common";

const BASE_FACTORY_CARD_IDS = Vec.range(0, 11);
const PROMO4_FACTORY_CARD_IDS = Vec.range(12, 17);
const ALL_FACTORY_CARD_IDS = Vec.concat(
  BASE_FACTORY_CARD_IDS,
  PROMO4_FACTORY_CARD_IDS
);

export const FactoryCards = {
  BASE_IDS: BASE_FACTORY_CARD_IDS,
  ALL_IDS: ALL_FACTORY_CARD_IDS,
} as const;
