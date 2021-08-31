import { GamePiecesColor } from "../../core/themeWithGameColors";
import IGame, { StepId } from "../IGame";
import IGameStep, { createGameStep } from "../IGameStep";
import MapStep from "./steps/MapStep";
import CityTilesStep from "./steps/CityTilesStep";
import MarketDisplayStep from "./steps/MarketDisplayStep";
import BonusTilesStep from "./steps/BonusTilesStep";
import PlayOrderStep from "../steps/PlayOrderStep";
import StartingColonistsStep from "./steps/StartingColonistsStep";
import StartingMoneyStep from "./steps/StartingMoneyStep";
import { PraefectusMagnusStep } from "./steps/PraefectusMagnusStep";
import FirstPlayerStep from "../steps/FirstPlayerStep";
import PlayerColorsStep from "../steps/PlayerColorsStep";

export default class ConcordiaGame implements IGame {
  private readonly steps: Readonly<{ [id: string]: IGameStep }>;

  public constructor() {
    this.steps = Object.fromEntries(
      [
        new MapStep(),
        new CityTilesStep(),
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
