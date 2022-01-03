import { Stack, Typography, useTheme } from "@mui/material";
import { $, Dict, Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { playersMetaStep } from "games/global";
import { useMemo } from "react";
import { Courts } from "../utils/Courts";
import { allFactionCubes, Factions } from "../utils/Factions";
import { Followers } from "../utils/Followers";
import courtStep from "./courtStep";
import followersStep from "./followersStep";

export default createDerivedGameStep({
  id: "supply",
  dependencies: [playersMetaStep, courtStep, followersStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, courtsIndex, followersIndex],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  number,
  number
>): JSX.Element {
  const theme = useTheme();

  const remaining = useMemo(
    () =>
      courtsIndex == null || followersIndex == null
        ? null
        : $(
            allFactionCubes(playerIds!.length),
            ($$) =>
              Vec.diff($$, Vec.flatten(Courts.decode(courtsIndex, playerIds!))),
            ($$) =>
              Vec.diff(
                $$,
                Followers.decode(followersIndex, playerIds!, courtsIndex)
              ),
            Dict.count_values
          ),
    [courtsIndex, followersIndex, playerIds]
  );

  return (
    <>
      <Typography variant="body1">
        Place the remaining cubes in the supply{remaining != null ? ":" : "."}
      </Typography>
      {remaining != null && (
        <Stack marginTop={2} marginX={3}>
          {Vec.map_with_key(remaining, (fid, count) => (
            <span key={`remaining_${fid}`}>
              <Typography
                fontSize="xx-large"
                component="span"
                lineHeight={1.0}
                color={theme.palette[Factions[fid].color].main}
              >
                {"\u25A0"}
              </Typography>{" "}
              x {count}
            </span>
          ))}
        </Stack>
      )}
    </>
  );
}
