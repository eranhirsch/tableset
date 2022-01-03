import { Stack, Typography } from "@mui/material";
import { $, MathUtils, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { playersMetaStep } from "games/global";
import { useMemo } from "react";
import { FactionId } from "../utils/Factions";
import { Followers } from "../utils/Followers";
import { ALL_REGION_IDS, REGION_NAME } from "../utils/Regions";
import courtStep from "./courtStep";
import { NUM_CUBES_PER_HOME_REGION } from "./homeRegionStep";

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
    () =>
      $(
        followersIndex,
        ($$) => Followers.decode($$, playerIds, courtsIndex),
        (allFollowers) =>
          ALL_REGION_IDS.reduce(
            (followers, regionId) =>
              $(
                Vec.map(followers, ({ length }) => length),
                MathUtils.sum,
                ($$) => Vec.drop(allFollowers, $$),
                ($$) =>
                  Vec.take(
                    $$,
                    Followers.NUM_PER_REGION -
                      (Followers.HOME_REGIONS[regionId] != null
                        ? NUM_CUBES_PER_HOME_REGION
                        : 0)
                  ),
                ($$) => Vec.concat(followers, [$$])
              ),
            [] as readonly (readonly FactionId[])[]
          )
      ),
    [courtsIndex, followersIndex, playerIds]
  );

  return (
    <>
      <Typography variant="body1">
        Put the following cubes in each region:
      </Typography>
      <Stack spacing={1} marginTop={2} marginX={2}>
        {Vec.map(
          Vec.zip(ALL_REGION_IDS, followers),
          ([regionId, followers]) => (
            <Typography key={`followers_regionId`} variant="body2">
              <strong>{REGION_NAME[regionId]}</strong>:{" "}
              {JSON.stringify(followers)}
            </Typography>
          )
        )}
      </Stack>
      <IndexHashCaption idx={followersIndex} />
    </>
  );
}
