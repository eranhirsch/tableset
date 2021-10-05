import { createGameStep } from "games/core/steps/createGameStep";
import { Game } from "model/Game";
import { GameStepBase } from "model/GameStepBase";
import { Product } from "model/Product";
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
import startingColonistsStep from "./steps/startingColonistsStep";
import startingMoneyStep from "./steps/startingMoneyStep";
import startingResourcesStep from "./steps/startingResourcesStep";

export type ConcordiaProductId = "base" | "britanniaGermania";
export const CONCORDIA_PRODUCTS = Object.freeze({
  base: { isBase: true, name: "Concordia", bggId: 124361, year: 2013 },
  britanniaGermania: {
    name: "Britannia / Germania",
    bggId: 165023,
    year: 2014,
  },
} as Record<ConcordiaProductId, Product>);

export default class ConcordiaGame implements Game {
  readonly steps: readonly GameStepBase[];
  readonly products = CONCORDIA_PRODUCTS;

  constructor() {
    this.steps = [
      mapStep,
      cityTilesStep,
      bonusTilesStep,
      germaniaRomanCastlesStep,
      marketCardsStep,
      marketDisplayStep,
      marketDeckStep,
      createGameStep({
        id: "concordiaCard",
        InstanceManualComponent: "Place the Concordia card next to the board.",
      }),
      createGameStep({
        id: "resourcePiles",
        InstanceManualComponent:
          "Separate the resources into piles near the board.",
      }),
      createGameStep({
        id: "bank",
        InstanceManualComponent:
          "Form a pile of coins as the bank near the board.",
      }),
      playOrderStep,
      createPlayerColorsStep(["black", "blue", "green", "red", "yellow"]),
      playerComponentsStep,
      startingColonistsStep,
      noStartingResourcesVariant,
      startingResourcesStep,
      firstPlayerStep,
      startingMoneyStep,
      praefectusMagnusStep,
    ];
  }
}
