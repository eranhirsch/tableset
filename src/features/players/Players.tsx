import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import playersSlice, { selectors as playersSelectors } from "./playersSlice";
import Player from "./Player";
import NewPlayerInput from "./NewPlayerInput";

export default function Players({
  playerCount: { min: minPlayerCount, max: maxPlayerCount },
}: {
  playerCount: { min: number; max: number };
}) {
  const dispatch = useAppDispatch();

  const playerIds = useAppSelector(playersSelectors.selectIds);

  useEffect(() => {
    if (playerIds.length === 0) {
      dispatch(
        playersSlice.actions.initialized([
          { name: "Eran Hirsch" },
          { name: "Amit Cwajghaft" },
          { name: "Adam Maoz" },
        ])
      );
    }
  }, [playerIds, dispatch]);

  return (
    <section>
      {playerIds.map((playerId) => (
        <Player playerId={playerId} isDeletable={playerIds.length > 2} />
      ))}
      {playerIds.length < maxPlayerCount && <NewPlayerInput />}
    </section>
  );
}
