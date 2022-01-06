import { Avatar, Stack, Typography, useTheme } from "@mui/material";
import { C, Str, Vec } from "common";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { PlayerId } from "features/players/playersSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { fullPlayOrder, playersMetaStep } from "games/global";
import React, { useMemo } from "react";
import { Courts } from "../utils/Courts";
import { Factions, NUM_FOLLOWERS_REMOVED_2P } from "../utils/Factions";
import firstPlayerStep from "./firstPlayerStep";
import playOrderStep from "./playOrderStep";

export default createRandomGameStep({
  id: "court",
  dependencies: [playersMetaStep, playOrderStep, firstPlayerStep],
  isTemplatable: () => true,
  resolve: (_, playerIds) => Courts.randomIndex(playerIds!),
  ...NoConfigPanel,
  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards: (props) => <IndexHashInstanceCard title="Court" {...props} />,
  instanceAvroType: "int",
});

function InstanceVariableComponent({
  value: courtsIndex,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const theme = useTheme();

  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const playOrder = useOptionalInstanceValue(playOrderStep);
  const firstPlayerId = useOptionalInstanceValue(firstPlayerStep);

  const courts = useMemo(
    () => Courts.decode(courtsIndex, playerIds),
    [courtsIndex, playerIds]
  );

  const playerCourts = useMemo(
    () =>
      Vec.zip(partialPlayOrder(playerIds, firstPlayerId, playOrder), courts),
    [courts, firstPlayerId, playOrder, playerIds]
  );

  return (
    <>
      <Typography variant="body1" textAlign="justify">
        Give each player{" "}
        {playerCourts.some(([playerId]) => playerId == null) &&
          "in play order "}
        the following <strong>{Courts.NUM_PER_PLAYER}</strong> followers to put
        in front of them, this is their court:
      </Typography>
      <Stack marginTop={2} marginX={2} spacing={1}>
        {Vec.map(playerCourts, ([playerId, factions], index) => (
          <span key={`court_${index}`}>
            {playerId != null ? (
              <PlayerAvatar playerId={playerId} inline />
            ) : (
              <Avatar component="span" sx={{ display: "inline-flex" }}>{`${
                index + 1
              }${Str.number_suffix(index + 1)}`}</Avatar>
            )}
            :{" "}
            {React.Children.toArray(
              Vec.map(factions, (fid) => (
                <Typography
                  fontSize="xx-large"
                  component="span"
                  lineHeight={1.0}
                  color={theme.palette[Factions[fid].color].main}
                >
                  {"\u25A0"}
                </Typography>
              ))
            )}
          </span>
        ))}
      </Stack>
      <IndexHashCaption idx={courtsIndex} />
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);

  return (
    <HeaderAndSteps>
      {playerIds.length === 2 && (
        <>
          Return <strong>{NUM_FOLLOWERS_REMOVED_2P}</strong> followers of each
          faction to the box.
        </>
      )}
      <>
        Place all {playerIds.length === 2 && "the remaining "}followers in the
        cloth bag.
      </>
      <>
        Randomly give each player <strong>{Courts.NUM_PER_PLAYER}</strong>{" "}
        followers to place in front of them. This is their court.
      </>
    </HeaderAndSteps>
  );
}

const partialPlayOrder = (
  playerIds: readonly PlayerId[],
  firstPlayerId: PlayerId | null,
  playOrder: readonly PlayerId[] | null
): readonly (PlayerId | null)[] =>
  firstPlayerId == null
    ? Vec.fill(playerIds.length, null)
    : playOrder == null
    ? Vec.concat(
        [firstPlayerId],
        playerIds.length === 2
          ? C.firstx(Vec.filter(playerIds, (pid) => pid !== firstPlayerId))
          : Vec.fill(playerIds.length - 1, null)
      )
    : fullPlayOrder(playerIds, playOrder, firstPlayerId);
