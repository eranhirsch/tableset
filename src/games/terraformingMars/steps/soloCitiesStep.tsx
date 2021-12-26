import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { playersMetaStep } from "games/global";

export default createDerivedGameStep({
  id: "soloCities",
  labelOverride: "Solo: Neutral Cities",
  dependencies: [playersMetaStep],
  skip: ([playerIds]) => playerIds!.length > 1,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [_playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  return <>TODO</>;
}
