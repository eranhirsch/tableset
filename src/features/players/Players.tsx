import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import playersSlice, { selectors as playersSelectors } from "./playersSlice";
import Player from "./Player";
import NewPlayerInput from "./NewPlayerInput";

export default function Players() {
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
    <>
      {playerIds.map((playerId) => (
        <Player key={playerId} playerId={playerId} />
      ))}
      <NewPlayerInput />
    </>
  );
}
