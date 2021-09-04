import { PlayerId } from "../../../features/players/playersSlice";
import { VariableStepInstanceComponentProps } from "../../core/steps/createVariableGameStep";
import Player from "./Player";

export default function FirstPlayerPanel({
  value: playerId,
}: VariableStepInstanceComponentProps<PlayerId>) {
  return <Player playerId={playerId} />;
}
