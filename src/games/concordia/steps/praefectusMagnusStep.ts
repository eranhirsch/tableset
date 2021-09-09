import createDerivedGameStep from "../../core/steps/createDerivedGameStep";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import firstPlayerStep from "../../global/steps/firstPlayerStep";
import playOrderStep from "../../global/steps/playOrderStep";
import PraefectusMagnus from "../ux/PraefectusMagnus";

export default createDerivedGameStep({
  id: "praefectusMagnus",
  dependencies: [
    createPlayersDependencyMetaStep(),
    playOrderStep,
    firstPlayerStep,
  ],
  InstanceDerivedComponent: PraefectusMagnus,
});
