import { $ } from "common";
import { GameId, GAMES } from "games/core/GAMES";
import { useParams } from "react-router-dom";
import { Game } from "./Game";

export function useGameFromParam(): Game {
  const { gameId } = useParams();
  return $(
    gameId,
    $.nullthrows(`Missing required url path param 'gameId'`),
    ($$) => GAMES[$$ as GameId],
    $.nullthrows(`Unknown game id ${gameId}`)
  );
}
