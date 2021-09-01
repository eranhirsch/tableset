import { GamePiecesColor } from "../../core/themeWithGameColors";
import MarketDisplayStep from "./steps/MarketDisplayStep";
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
import PlayOrderStep from "../global/steps/PlayOrderStep";
import cityTilesStep from "./steps/cityTilesStep";

export default class ConcordiaGame implements IGame {
  private readonly steps: Readonly<{ [id: string]: IGameStep }>;

  public constructor() {
    this.steps = Object.fromEntries(
      [
        mapStep,
        cityTilesStep,
        new BonusTilesStep(),
        createGameStep({ id: "marketCards" }),
        new MarketDisplayStep(),
        createGameStep({ id: "marketDeck", labelOverride: "Cards Deck" }),
        createGameStep({ id: "concordiaCard" }),
        createGameStep({ id: "resourcePiles" }),
        createGameStep({ id: "bank" }),
        new PlayOrderStep(),
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

  public at(id: string): IGameStep | undefined {
    return this.steps[id];
  }

  public get order(): StepId[] {
    return Object.keys(this.steps);
  }

  public get playerColors(): GamePiecesColor[] {
    return ["black", "blue", "green", "red", "yellow"];
  }
}
