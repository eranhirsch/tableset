import {
  Avatar,
  Divider,
  Grid,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Str, Vec } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { partialPlayOrder, playersMetaStep } from "games/global";
import React, { useMemo } from "react";
import { Food, FoodTypeId } from "../utils/Food";
import firstPlayerStep from "./firstPlayerStep";
import { BIRD_CARDS_PER_PLAYER } from "./playerComponentsStep";
import playOrderStep from "./playOrderStep";
import swiftStartVariant from "./swiftStartVariant";

interface SwiftStart {
  birds: readonly string[];
  food: readonly FoodTypeId[];
}
export const SWIFT_START: [SwiftStart, SwiftStart, SwiftStart, SwiftStart] = [
  // Spell-checker: Disable
  {
    birds: ["American Redstart", "Broad-winged Hawk"],
    food: ["invertebrate", "rodent", "fruit"],
  },
  {
    birds: ["Canvasback", "Vaux's Swift"],
    food: ["invertebrate", "seed", "fruit"],
  },
  {
    birds: ["White-throated Swift", "Scaled Quail", "Brant"],
    food: ["invertebrate", "seed"],
  },
  {
    birds: [
      "Red-breasted Merganser",
      "Black-chinned Hummingbird",
      "Painted Whitestart",
    ],
    food: ["fish", "invertebrate"],
  },
  // Spell-checker: Enable
];

const BirdName = styled("strong")({
  fontVariantCaps: "petite-caps",
});

export default createDerivedGameStep({
  id: "swiftStartGuides",
  labelOverride: "Swift-Start: Guides",
  dependencies: [
    playersMetaStep,
    playOrderStep,
    firstPlayerStep,
    swiftStartVariant,
  ],
  skip: ([isSwiftStart]) => !isSwiftStart,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, playOrder, firstPlayerId, isSwiftStart],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly PlayerId[],
  PlayerId,
  boolean
>): JSX.Element {
  const order = useMemo(
    () => partialPlayOrder(playerIds!, firstPlayerId, playOrder),
    [firstPlayerId, playOrder, playerIds]
  );
  return (
    <>
      <Typography variant="body1" textAlign="justify">
        Each player takes:{" "}
      </Typography>
      <Stack marginTop={2} spacing={1} divider={<Divider />}>
        {Vec.map(Vec.take(order, SWIFT_START.length), (playerId, index) => (
          <SwiftPlayer
            key={`player_${index}`}
            playerId={playerId}
            index={index}
          />
        ))}
        {playerIds!.length > SWIFT_START.length && (
          <ExtraPlayer playerId={order[SWIFT_START.length]} />
        )}
      </Stack>
    </>
  );
}

function SwiftPlayer({
  playerId,
  index,
}: {
  playerId: PlayerId | null;
  index: number;
}): JSX.Element {
  return (
    <Box display="flex" alignItems="center">
      {playerId != null ? (
        <PlayerAvatar playerId={playerId} inline />
      ) : (
        <Avatar>
          {index + 1}
          {Str.number_suffix(index + 1)}
        </Avatar>
      )}
      <Grid container marginX={1} spacing={1} alignItems="center">
        <Grid item xs={2} fontSize="x-small" textAlign="right">
          Guide
        </Grid>
        <Grid item xs={10}>
          Player {index + 1}
        </Grid>
        <Grid item xs={2} fontSize="x-small" textAlign="right">
          Birds
        </Grid>
        <Grid item xs={10}>
          <GrammaticalList>
            {React.Children.toArray(
              Vec.map(SWIFT_START[index].birds, (bird) => (
                <BirdName>{bird}</BirdName>
              ))
            )}
          </GrammaticalList>
        </Grid>
        <Grid item xs={2} fontSize="x-small" textAlign="right">
          Food
        </Grid>
        <Grid item xs={10}>
          <GrammaticalList>
            {React.Children.toArray(
              Vec.map(SWIFT_START[index].food, (foodId) => (
                <strong>{Food.LABELS[foodId]}</strong>
              ))
            )}
          </GrammaticalList>
        </Grid>
      </Grid>
    </Box>
  );
}

function ExtraPlayer({ playerId }: { playerId: PlayerId | null }): JSX.Element {
  return (
    <Box display="flex" alignItems="center">
      {playerId != null ? (
        <PlayerAvatar playerId={playerId} inline />
      ) : (
        <Avatar>
          {SWIFT_START.length + 1}
          {Str.number_suffix(SWIFT_START.length + 1)}
        </Avatar>
      )}
      <Grid container marginX={1} spacing={1} alignItems="center">
        <Grid item xs={2} fontSize="x-small" textAlign="right">
          Birds
        </Grid>
        <Grid item xs={10}>
          <strong>{BIRD_CARDS_PER_PLAYER}</strong> random bird cards.
        </Grid>
        <Grid item xs={2} fontSize="x-small" textAlign="right">
          Food
        </Grid>
        <Grid item xs={10}>
          <GrammaticalList>
            {React.Children.toArray(
              Vec.map(Food.ALL_IDS, (foodId) => (
                <strong>{Food.LABELS[foodId]}</strong>
              ))
            )}
          </GrammaticalList>
        </Grid>
      </Grid>
    </Box>
  );
}
