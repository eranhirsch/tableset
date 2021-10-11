import { createGameStep } from "games/core/steps/createGameStep";
import { createGame } from "model/Game";
import createPlayerColorsStep from "../global/steps/createPlayerColorsStep";
import firstPlayerStep from "../global/steps/firstPlayerStep";
import playOrderStep from "../global/steps/playOrderStep";
import bonusTilesStep from "./steps/bonusTilesStep";
import cityTilesStep from "./steps/cityTilesStep";
import germaniaRomanCastlesStep from "./steps/germaniaRomanCastlesStep";
import mapStep from "./steps/mapStep";
import marketCardsStep from "./steps/marketCardsStep";
import marketDeckStep from "./steps/marketDeckStep";
import marketDisplayStep from "./steps/marketDisplayStep";
import noStartingResourcesVariant from "./steps/noStartingResourcesVariant";
import playerComponentsStep from "./steps/playerComponentsStep";
import praefectusMagnusStep from "./steps/praefectusMagnusStep";
import { productsMetaStep } from "./steps/productsMetaStep";
import resourcePilesStep from "./steps/resourcePilesStep";
import salsaVariantStep from "./steps/salsaVariantStep";
import startingColonistsStep from "./steps/startingColonistsStep";
import startingMoneyStep from "./steps/startingMoneyStep";
import startingResourcesStep from "./steps/startingResourcesStep";

export const concordiaGame = createGame({
  products: {
    base: { isBase: true, name: "Concordia", bggId: 124361, year: 2013 },
    britanniaGermania: {
      name: "Britannia / Germania",
      bggId: 165023,
      year: 2014,
    },
    salsa: { name: "Salsa", bggId: 181084, year: 2015 },
  },

  productsMetaStep,

  steps: [
    mapStep, // Templatable
    salsaVariantStep, // Templatable
    cityTilesStep, // Templatable
    bonusTilesStep,
    germaniaRomanCastlesStep, // Templatable
    marketCardsStep,
    marketDisplayStep, // Templatable
    marketDeckStep,
    createGameStep({
      id: "concordiaCard",
      InstanceManualComponent: "Place the Concordia card next to the board.",
    }),
    resourcePilesStep,
    createGameStep({
      id: "bank",
      InstanceManualComponent:
        "Form a pile of coins as the bank near the board.",
    }),
    playOrderStep, // Templatable
    createPlayerColorsStep(["black", "blue", "green", "red", "yellow"]), // Templatable
    playerComponentsStep,
    startingColonistsStep,
    noStartingResourcesVariant, // Templatable
    startingResourcesStep,
    firstPlayerStep, // Templatable
    startingMoneyStep,
    praefectusMagnusStep,
  ],
});
