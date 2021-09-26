import { nullthrows } from "../../common";
import GamePiecesColor from "../../model/GamePiecesColor";
import IGame, { StepId } from "../core/IGame";
import createGameStep from "../core/steps/createGameStep";
import IGameStep from "../core/steps/IGameStep";
import createPlayerColorsStep from "../global/steps/createPlayerColorsStep";
import firstPlayerStep from "../global/steps/firstPlayerStep";
import playOrderStep from "../global/steps/playOrderStep";
import bonusTilesStep from "./steps/bonusTilesStep";
import cityTilesStep from "./steps/cityTilesStep";
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

export default class ConcordiaGame implements IGame {
  public readonly steps: readonly Readonly<IGameStep<unknown>>[];

  public constructor() {
    this.steps = [
      mapStep,
      cityTilesStep,
      bonusTilesStep,
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
      createPlayerColorsStep(this.playerColors),
      playerComponentsStep,
      startingColonistsStep,
      noStartingResourcesVariant,
      startingResourcesStep,
      firstPlayerStep,
      startingMoneyStep,
      praefectusMagnusStep,
    ];
  }

  public atNullable(id: StepId): Readonly<IGameStep<unknown>> | undefined {
    return this.steps.find((step) => step.id === id);
  }

  public atEnforce(id: StepId): Readonly<IGameStep<unknown>> {
    return nullthrows(
      this.atNullable(id),
      `${this.constructor.name} does not define step ${id}`
    );
  }

  public get playerColors(): readonly GamePiecesColor[] {
    return ["black", "blue", "green", "red", "yellow"];
  }
}
