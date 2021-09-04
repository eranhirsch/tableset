import createDerivedGameStep from "../../core/steps/createDerivedGameStep";
import firstPlayerStep from "../../global/steps/firstPlayerStep";
import playOrderStep from "../../global/steps/playOrderStep";
import StartingMoney from "../ux/StartingMoney";

export default createDerivedGameStep({
  id: "startingMoney",
  dependencies: [playOrderStep, firstPlayerStep],
  renderDerived: StartingMoney,
});
