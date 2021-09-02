import { GamePiecesColor } from "../../core/themeWithGameColors";
import marketDisplayStep from "./steps/marketDisplayStep";
import mapStep from "./steps/mapStep";
import createGameStep from "../core/steps/createGameStep";
import IGameStep from "../core/steps/IGameStep";
import IGame from "../core/IGame";
import cityTilesStep from "./steps/cityTilesStep";
import playOrderStep from "../global/steps/playOrderStep";
import createPlayerColorsStep from "../global/steps/createPlayerColorsStep";
import firstPlayerStep from "../global/steps/firstPlayerStep";
import bonusTilesStep from "./steps/bonusTilesStep";
import praefectusMagnusStep from "./steps/praefectusMagnusStep";
import startingColonistsStep from "./steps/startingColonistsStep";
import startingMoneyStep from "./steps/startingMoneyStep";
import marketCardsStep from "./steps/marketCardsStep";

export default class ConcordiaGame implements IGame {
  public readonly steps: readonly IGameStep<unknown>[];

  public constructor() {
    this.steps = [
      mapStep,
      cityTilesStep,
      bonusTilesStep,
      createGameStep({ id: "marketCards" }),
      marketDisplayStep,
      marketCardsStep,
      createGameStep({ id: "concordiaCard" }),
      createGameStep({ id: "resourcePiles" }),
      createGameStep({ id: "bank" }),
      playOrderStep,
      createPlayerColorsStep(this.playerColors),
      createGameStep({ id: "playerComponents" }),
      startingColonistsStep,
      createGameStep({ id: "startingResources" }),
      firstPlayerStep,
      startingMoneyStep,
      praefectusMagnusStep,
    ];
  }

  public at(id: string): IGameStep<unknown> | undefined {
    return this.steps.find((step) => step.id === id);
  }

  public get playerColors(): GamePiecesColor[] {
    return ["black", "blue", "green", "red", "yellow"];
  }
}
