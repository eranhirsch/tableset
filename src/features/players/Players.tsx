import { useAppSelector } from "../../app/hooks";
import { playersSelectors } from "./playersSlice";
import NewPlayerInput from "./NewPlayerInput";
import PlayerChip from "./PlayerChip";

export default function Players(): JSX.Element | null {
  const playerIds = useAppSelector(playersSelectors.selectIds);

  return (
    <>
      {playerIds.map((playerId) => (
        <PlayerChip key={playerId} playerId={playerId} />
      ))}
      <NewPlayerInput />
    </>
  );
}
