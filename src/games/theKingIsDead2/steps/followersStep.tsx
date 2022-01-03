import { Grid, Typography, useTheme } from "@mui/material";
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
import React, { useMemo } from "react";
import { FactionId, Factions } from "../utils/Factions";
import { Followers } from "../utils/Followers";
import { ALL_REGION_IDS, REGION_NAME } from "../utils/Regions";
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
  const theme = useTheme();

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
                        ? Followers.NUM_PER_HOME_REGION
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
      <Grid container marginY={2} paddingX={2}>
        {Vec.map(
          Vec.zip(ALL_REGION_IDS, followers),
          ([regionId, followers]) => (
            <React.Fragment key={`followers_${regionId}`}>
              <Grid item xs={1} />
              <Grid item xs={6} alignSelf="center">
                <strong>{REGION_NAME[regionId]}</strong>
              </Grid>
              {$(
                Followers.HOME_REGIONS[regionId],
                ($$) => Vec.fill(Followers.NUM_PER_HOME_REGION, $$),
                Vec.filter_nulls,
                ($$) => Vec.concat($$, followers),
                Vec.sort,
                ($$) =>
                  Vec.map($$, (factionId) => (
                    <Grid item xs={1} textAlign="center" alignSelf="center">
                      <Typography
                        fontSize="xx-large"
                        component="span"
                        lineHeight={1.0}
                        color={theme.palette[Factions[factionId].color].main}
                      >
                        {"\u25A0"}
                      </Typography>
                    </Grid>
                  )),
                React.Children.toArray
              )}
              <Grid item xs={1} />
            </React.Fragment>
          )
        )}
      </Grid>
      <IndexHashCaption idx={followersIndex} />
    </>
  );
}
