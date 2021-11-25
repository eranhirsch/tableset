import { $ } from "common";
import { GameId, GAMES } from "games/core/GAMES";
import { Game } from "model/Game";
import { useParams } from "react-router-dom";

export function useGameFromParam(): Game {
  const { gameId } = useParams();
  return $(
    gameId,
    $.nullthrows(`Missing required url path param 'gameId'`),
    ($$) => GAMES[$$ as GameId],
    $.nullthrows(`Unknown game id ${gameId}`)
  );
}
