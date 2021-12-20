import { createGame } from "games/core/Game";
import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";
import dealEvidenceStep from "./steps/dealEvidenceStep";
import decoderStep from "./steps/decoderStep";
import evidenceDeckStep from "./steps/evidenceDeckStep";
import firstPlayerStep from "./steps/firstPlayerStep";
import locationsStep from "./steps/locationsStep";
import playerMatsStep from "./steps/playerMatsStep";
import playOrderStep from "./steps/playOrderStep";
import startLocationStep from "./steps/startLocationStep";

const productsMetaStep = createProductsMetaStep();

export default createGame({
  id: "scapeGoat",
  name: "Scape Goat",
  products: {
    base: { name: "Scape Goat", bggId: 315043, isBase: true, year: 2020 },
  },
  productsMetaStep,
  steps: [
    playOrderStep, // Templatable
    playerMatsStep, // Templatable
    locationsStep,
    startLocationStep, // Templatable
    evidenceDeckStep,
    dealEvidenceStep,
    decoderStep, // Templatable
    firstPlayerStep,
  ],
});
