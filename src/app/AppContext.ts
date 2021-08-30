import { GameId } from "../games/GameMapper";

export default interface AppContext {
  gameId: GameId;
  playersTotal: number;
}
