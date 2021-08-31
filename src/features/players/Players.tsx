import { useAppSelector } from "../../app/hooks";
import { playersSelectors } from "./playersSlice";
import Player from "./Player";
import NewPlayerInput from "./NewPlayerInput";

export default function Players() {
  const playerIds = useAppSelector(playersSelectors.selectIds);

  return (
    <>
      {playerIds.map((playerId) => (
        <Player key={playerId} playerId={playerId} />
      ))}
      <NewPlayerInput />
    </>
  );
}
