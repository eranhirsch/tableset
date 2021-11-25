import { nullthrows } from "common";
import { GameId, GAMES } from "games/core/GAMES";
import { Game } from "model/Game";
import { useParams } from "react-router-dom";

export function useGameFromParam(): Game | null {
  const { gameId } = useParams();

  if (gameId == null) {
    return null;
  }

  return nullthrows(GAMES[gameId as GameId], `Unknown game id ${gameId}`);
}
