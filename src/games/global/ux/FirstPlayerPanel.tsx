import { PlayerId } from "../../../features/players/playersSlice";
import { VariableStepInstanceComponentProps } from "../../core/steps/createVariableGameStep";
import Player from "./Player";

export default function FirstPlayerPanel({
  value: playerId,
}: VariableStepInstanceComponentProps<PlayerId>): JSX.Element {
  return <Player playerId={playerId} />;
}
