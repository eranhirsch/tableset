import createDerivedGameStep from "../../core/steps/createDerivedGameStep";
import BonusTiles from "../ux/BonusTiles";
import cityTilesStep from "./cityTilesStep";
import mapStep from "./mapStep";

export default createDerivedGameStep({
  id: "bonusTiles",
  labelOverride: "Province Bonuses",

  dependencies: [mapStep, cityTilesStep],

  renderDerived: BonusTiles,
});
