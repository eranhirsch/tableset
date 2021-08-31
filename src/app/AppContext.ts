import { GameId } from "../games/core/GameMapper";

export default interface AppContext {
  gameId: GameId;
  playersTotal: number;
}
