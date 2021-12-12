import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";

export type BloodRageProductId =
  /* Spell-checker: disable */
  | "base"
  | "fenrir"
  | "giant"
  | "gods"
  | "hili"
  | "ksExclusives"
  | "mystics"
  | "player5"
  | "player5Extras"
  | "promos"
  | "troll";
/* Spell-checker: enable */

export default createProductsMetaStep<BloodRageProductId>();
