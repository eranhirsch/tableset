import { Avatar, Chip, Stack, Typography } from "@mui/material";
import { $, C, Random, Str, Vec } from "common";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { fullPlayOrder, playersMetaStep } from "games/global";
import React, { useMemo } from "react";
import {
  allFactionCubes,
  ALL_FACTION_IDS,
  FactionId,
  Factions,
} from "../utils/Factions";
import firstPlayerStep from "./firstPlayerStep";
import playOrderStep from "./playOrderStep";

const NUM_FOLLOWERS_PER_PLAYER = 2;

export default createRandomGameStep({
  id: "court",
  dependencies: [playersMetaStep, playOrderStep, firstPlayerStep],
  isTemplatable: () => true,
  resolve: (_, playerIds) =>
    $(
      allFactionCubes(playerIds!.length),
      // Take out a random sample of cubes
      ($$) => Random.sample($$, playerIds!.length * NUM_FOLLOWERS_PER_PLAYER),
      // Shuffle them (so that all players can get each one)
      Random.shuffle,
      // Chunk them back per player so we can sort them (to normalize the
      // result)
      ($$) => Vec.chunk($$, NUM_FOLLOWERS_PER_PLAYER),
      ($$) => Vec.map($$, (factions) => Vec.sort(factions)),
      // Then flatten the results because we don't need the extra layer for
      // serialization
      Vec.flatten
    ),
  ...NoConfigPanel,
  InstanceVariableComponent,
  instanceAvroType: {
    type: "array",
    items: { type: "enum", name: "FactionId", symbols: [...ALL_FACTION_IDS] },
  },
});

function InstanceVariableComponent({
  value: factionIds,
}: VariableStepInstanceComponentProps<readonly FactionId[]>): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const playOrder = useOptionalInstanceValue(playOrderStep);
  const firstPlayerId = useOptionalInstanceValue(firstPlayerStep);

  const court = useMemo(
    () =>
      $(
        firstPlayerId == null
          ? Vec.fill(playerIds.length, null)
          : playOrder == null
          ? Vec.concat(
              [firstPlayerId],
              playerIds.length === 2
                ? C.firstx(
                    Vec.filter(playerIds, (pid) => pid !== firstPlayerId)
                  )
                : Vec.fill(playerIds.length - 1, null)
            )
          : fullPlayOrder(playerIds, playOrder, firstPlayerId),
        ($$) => Vec.zip($$, Vec.chunk(factionIds, NUM_FOLLOWERS_PER_PLAYER))
      ),
    [factionIds, firstPlayerId, playOrder, playerIds]
  );

  return (
    <>
      <Typography variant="body1" textAlign="justify">
        Give each player{" "}
        {(playOrder == null || firstPlayerId == null) && "in play order "}the
        following <strong>{NUM_FOLLOWERS_PER_PLAYER}</strong> follower to put in
        front of them, this is their court:
      </Typography>
      <Stack marginTop={2} marginX={2} spacing={1}>
        {Vec.map(court, ([playerId, factions], index) => (
          <span key={`court_${index}`}>
            {playerId != null ? (
              <PlayerAvatar playerId={playerId} inline />
            ) : (
              <Avatar component="span" sx={{ display: "inline-flex" }}>{`${
                index + 1
              }${Str.number_suffix(index + 1)}`}</Avatar>
            )}
            :{" "}
            <GrammaticalList>
              {React.Children.toArray(
                Vec.map(factions, (fid) => (
                  <Chip
                    size="small"
                    color={Factions[fid].color}
                    label={Factions[fid].name}
                  />
                ))
              )}
            </GrammaticalList>
            .
          </span>
        ))}
      </Stack>
    </>
  );
}
