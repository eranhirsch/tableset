import { Game } from "model/Game";
import ConcordiaGame from "../concordia/ConcordiaGame";

export type GameId = "concordia";

export default abstract class GameMapper {
  private static readonly memoizedGames: Map<GameId, Game> = new Map();

  public static forId(id: GameId): Game {
    let game = GameMapper.memoizedGames.get(id);
    if (game == null) {
      game = GameMapper.mapper(id);
      GameMapper.memoizedGames.set(id, game);
    }
    return game;
  }

  private static mapper(id: GameId): Game {
    switch (id) {
      case "concordia":
        return new ConcordiaGame();
    }
  }
}
