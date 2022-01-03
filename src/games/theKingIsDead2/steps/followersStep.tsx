import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { playersMetaStep } from "games/global";
import { useMemo } from "react";
import { Followers } from "../utils/Followers";
import courtStep from "./courtStep";

export default createRandomGameStep({
  id: "followers",
  dependencies: [playersMetaStep, courtStep],
  isTemplatable: (_players, court) => court.willResolve(),
  resolve: (_, playerIds, courtsIndex) =>
    Followers.randomIndex(playerIds!, courtsIndex!),
  ...NoConfigPanel,
  InstanceVariableComponent,
  InstanceCards: (props) => (
    <IndexHashInstanceCard title="Followers" {...props} />
  ),
  instanceAvroType: "long",
});

function InstanceVariableComponent({
  value: followersIndex,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const courtsIndex = useRequiredInstanceValue(courtStep);
  const followers = useMemo(
    () => Followers.decode(followersIndex, playerIds, courtsIndex),
    [courtsIndex, followersIndex, playerIds]
  );
  return <>TODO</>;
}
