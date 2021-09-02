import { GamePiecesColor } from "../../core/themeWithGameColors";
import marketDisplayStep from "./steps/marketDisplayStep";
import BonusTilesStep from "./steps/BonusTilesStep";
import StartingColonistsStep from "./steps/StartingColonistsStep";
import StartingMoneyStep from "./steps/StartingMoneyStep";
import { PraefectusMagnusStep } from "./steps/PraefectusMagnusStep";
import FirstPlayerStep from "../global/steps/FirstPlayerStep";
import mapStep from "./steps/mapStep";
import { createGameStep } from "../core/steps/createGameStep";
import IGameStep from "../core/steps/IGameStep";
import IGame, { StepId } from "../core/IGame";
import PlayerColorsStep from "../global/steps/PlayerColorsStep";
import cityTilesStep from "./steps/cityTilesStep";
import playOrderStep from "../global/steps/playOrderStep";

export default class ConcordiaGame implements IGame {
  private readonly steps: Readonly<{ [id: string]: IGameStep<any> }>;

  public constructor() {
    this.steps = Object.fromEntries(
      [
        mapStep,
        cityTilesStep,
        new BonusTilesStep(),
        createGameStep({ id: "marketCards" }),
        marketDisplayStep,
        createGameStep({ id: "marketDeck", labelOverride: "Cards Deck" }),
        createGameStep({ id: "concordiaCard" }),
        createGameStep({ id: "resourcePiles" }),
        createGameStep({ id: "bank" }),
        playOrderStep,
        new PlayerColorsStep(this.playerColors),
        createGameStep({
          id: "playerPieces",
          labelOverride: "Player Components",
        }),
        new StartingColonistsStep(),
        createGameStep({ id: "startingResources" }),
        new FirstPlayerStep(),
        new StartingMoneyStep(),
        new PraefectusMagnusStep(),
      ].map((step) => [step.id, step])
    );
  }

  public at(id: string): IGameStep<any> | undefined {
    return this.steps[id];
  }

  public get order(): StepId[] {
    return Object.keys(this.steps);
  }

  public get playerColors(): GamePiecesColor[] {
    return ["black", "blue", "green", "red", "yellow"];
  }
}
