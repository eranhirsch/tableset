import { GamePiecesColor } from "../../core/themeWithGameColors";
import IGame, { StepId } from "../IGame";
import IGameStep from "../IGameStep";
import GenericGameStep from "../GenericGameStep";
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
        new GenericGameStep("marketCards"),
        new MarketDisplayStep(),
        new GenericGameStep("marketDeck", "Cards Deck"),
        new GenericGameStep("concordiaCard"),
        new GenericGameStep("resourcePiles"),
        new GenericGameStep("bank"),
        new PlayOrderStep(),
        new PlayerColorsStep(this.playerColors),
        new GenericGameStep("playerPieces", "Player Components"),
        new StartingColonistsStep(),
        new GenericGameStep("startingResources"),
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
