import nullthrows from "../../common/err/nullthrows";
import { GamePiecesColor } from "../../core/themeWithGameColors";
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
import marketDisplayStep from "./steps/marketDisplayStep";
import praefectusMagnusStep from "./steps/praefectusMagnusStep";
import startingColonistsStep from "./steps/startingColonistsStep";
import startingMoneyStep from "./steps/startingMoneyStep";

export default class ConcordiaGame implements IGame {
  public readonly steps: readonly IGameStep<unknown>[];

  public constructor() {
    this.steps = [
      mapStep,
      cityTilesStep,
      bonusTilesStep,
      marketCardsStep,
      marketDisplayStep,
      createGameStep({ id: "marketDeck" }),
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

  public atNullable(id: StepId): IGameStep<unknown> | undefined {
    return this.steps.find((step) => step.id === id);
  }

  public atEnforce(id: StepId): IGameStep<unknown> {
    return nullthrows(
      this.atNullable(id),
      `${this.constructor.name} does not define step ${id}`
    );
  }

  public get playerColors(): GamePiecesColor[] {
    return ["black", "blue", "green", "red", "yellow"];
  }
}
