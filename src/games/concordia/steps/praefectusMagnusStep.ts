import createDerivedGameStep from "../../core/steps/createDerivedGameStep";
import firstPlayerStep from "../../global/steps/firstPlayerStep";
import playOrderStep from "../../global/steps/playOrderStep";
import PraefectusMagnus from "../ux/PraefectusMagnus";

export default createDerivedGameStep({
  id: "praefectusMagnus",
  dependencies: [playOrderStep, firstPlayerStep],
  renderDerived: PraefectusMagnus,
});
