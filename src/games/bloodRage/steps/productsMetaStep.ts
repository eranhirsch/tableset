import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";

export type BloodRageProductId =
  /* Spell-checker: disable */
  | "base"
  | "mystics"
  | "troll"
  | "giant"
  | "ksExclusives"
  | "gods"
  | "fenrir"
  | "player5"
  | "hili"
  | "promos";
/* Spell-checker: enable */

export default createProductsMetaStep<BloodRageProductId>();
