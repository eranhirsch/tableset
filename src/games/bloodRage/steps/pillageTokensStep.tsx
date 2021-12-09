import { Chip, Grid, Typography } from "@mui/material";
import { $, MathUtils, nullthrows, Random, Vec } from "common";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import React, { useMemo } from "react";
import { Destroyed } from "../utils/Destroyed";
import { Provinces } from "../utils/Provinces";
import destroyedStep from "./destroyedStep";
import ragnarokStep from "./ragnarokStep";

const ALL_PILLAGE_TOKEN_TYPES = ["rage", "axe", "horn", "glory"] as const;
type PillageTokenType = typeof ALL_PILLAGE_TOKEN_TYPES[number];
const PILLAGE_TOKEN_COUNTS: Readonly<
  Required<Record<PillageTokenType, number>>
> = {
  axe: 2,
  glory: 1,
  horn: 2,
  rage: 3,
};
const PILLAGE_TOKENS = Vec.flatten(
  Vec.map_with_key(PILLAGE_TOKEN_COUNTS, (tokenType, count) =>
    Vec.fill(count, tokenType)
  )
);

export default createRandomGameStep({
  id: "pillageTokens",
  dependencies: [playersMetaStep, ragnarokStep, destroyedStep],
  isTemplatable: () => true,

  resolve: (_, playerIds, ragnarokIdx, destroyedIdx) =>
    resolve(playerIds!, ragnarokIdx, destroyedIdx),

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards: (props) => (
    <IndexHashInstanceCard {...props} title="Pillage Tokens" />
  ),

  instanceAvroType: "int",
  ...NoConfigPanel,
});

function resolve(
  playerIds: readonly PlayerId[],
  ragnarokIdx: number | null,
  destroyedIdx: number | null
): number {
  if (destroyedIdx == null) {
    return Random.index(MathUtils.permutations_lazy_array(PILLAGE_TOKENS));
  }

  // We need to remove tokens because of the destroyed provinces which won't
  // need a token any more.
  const removedTokens = $(
    destroyedIdx,
    ($$) =>
      Destroyed.decode(
        $$,
        playerIds!.length,
        nullthrows(
          ragnarokIdx,
          `RagnarokIdx is null when DestroyedIdx ${destroyedIdx} isn't?!`
        )
      ),
    ($$) => $$.length,
    ($$) => Random.sample(PILLAGE_TOKENS, $$)
  );

  // We find the "encoding" of the removed tokens so we can serialize the
  // result as a number.
  const removedArr = MathUtils.combinations_lazy_array_with_duplicates(
    PILLAGE_TOKENS,
    removedTokens.length
  );
  const removedIdx = removedArr.indexOf(removedTokens);

  // Get a random ordering of the remaining tokens
  const permIdx = $(
    Vec.diff(PILLAGE_TOKENS, removedTokens),
    ($$) => MathUtils.permutations_lazy_array($$),
    ($$) => Random.index($$)
  );

  // We use the removedArr as a radix so that we can reverse this computation
  return permIdx * removedArr.length + removedIdx;
}

function InstanceVariableComponent({
  value: pillageTokenIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const ragnarokIdx = useOptionalInstanceValue(ragnarokStep);
  const destroyedIdx = useOptionalInstanceValue(destroyedStep);

  const tokens = useMemo(
    () => decode(pillageTokenIdx, playerIds, ragnarokIdx, destroyedIdx),
    [destroyedIdx, pillageTokenIdx, playerIds, ragnarokIdx]
  );

  return (
    <>
      <Typography variant="body1">
        Put the following <ChosenElement>Pillage Token</ChosenElement> with the
        reward side facing up in each province:
      </Typography>
      <Grid container spacing={1} maxWidth="100%" paddingRight={1} marginY={2}>
        {$(
          Vec.range(0, 8),
          ($$) =>
            Vec.map($$, (gridIdx) => (
              <Grid item xs={4}>
                <MapRegion gridIdx={gridIdx} tokens={tokens} />
              </Grid>
            )),
          React.Children.toArray
        )}
      </Grid>
      <IndexHashCaption idx={pillageTokenIdx} />
    </>
  );
}

function MapRegion({
  gridIdx,
  tokens,
}: {
  gridIdx: number;
  tokens: readonly (PillageTokenType | null)[];
}): JSX.Element {
  const pos = gridIndexToPosition(gridIdx);

  if (pos == null) {
    return (
      <Chip sx={{ width: "100%" }} color="green" label={<em>Yggdrasil</em>} />
    );
  }

  return (
    <Chip
      sx={{ width: "100%" }}
      color={
        tokens[pos] == null ? "red" : Provinces.color(Provinces.atPosition(pos))
      }
      label={<strong>{label(tokens[pos])}</strong>}
    />
  );
}

function InstanceManualComponent(): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const ragnarokIdx = useOptionalInstanceValue(ragnarokStep);
  const destroyedIdx = useOptionalInstanceValue(destroyedStep);

  const destroyed = useMemo(
    () =>
      destroyedIdx == null
        ? null
        : Destroyed.decode(destroyedIdx, playerIds.length, ragnarokIdx!),
    [destroyedIdx, playerIds.length, ragnarokIdx]
  );

  return (
    <HeaderAndSteps synopsis="The Pillage tokens show the reward you get for pillaging that province.">
      <>
        Take all <strong>9</strong>{" "}
        <ChosenElement>Pillage tokens</ChosenElement>.
      </>
      <>
        Place the one with the green border on the{" "}
        <ChosenElement>Yggdrasil</ChosenElement> province at the center of the
        board, with the reward side facing up.
      </>
      <>
        Flip the remaining <strong>8</strong> Pillage tokens, hiding the bonus.
      </>
      <>Shuffle them.</>
      <>
        Place them randomly on the other provinces surrounding Yggdrasil, face
        up
        {destroyed != null
          ? !Vec.is_empty(destroyed) && (
              <>
                , skipping{" "}
                <GrammaticalList>
                  {React.Children.toArray(
                    Vec.map(destroyed, (pid) => <em>{Provinces.label(pid)}</em>)
                  )}
                </GrammaticalList>
              </>
            )
          : Destroyed.perPlayerCount(playerIds.length) > 0 && (
              <>
                , skipping the{" "}
                <strong>{Destroyed.perPlayerCount(playerIds.length)}</strong>{" "}
                destroyed provinces
              </>
            )}
        .
      </>
      {(destroyed != null
        ? !Vec.is_empty(destroyed) && (
            <>
              You should have <strong>{destroyed.length}</strong> tokens
              remaining.
            </>
          )
        : Destroyed.perPlayerCount(playerIds.length) > 0) && (
        <>
          You should have{" "}
          <strong>{Destroyed.perPlayerCount(playerIds.length)}</strong> tokens
          remaining.
        </>
      )}
    </HeaderAndSteps>
  );
}

function decode(
  pillageTokensIdx: number,
  playerIds: readonly PlayerId[],
  ragnarokIdx: number | null,
  destroyedIdx: number | null
): readonly (PillageTokenType | null)[] {
  if (destroyedIdx == null) {
    return $(
      PILLAGE_TOKENS,
      ($$) => MathUtils.permutations_lazy_array($$),
      ($$) => $$.at(pillageTokensIdx),
      $.nullthrows(`Index ${pillageTokensIdx} is out of range`)
    );
  }

  const destroyed = Destroyed.decode(
    destroyedIdx,
    playerIds.length,
    nullthrows(
      ragnarokIdx,
      `RagnarokIdx is null when DestroyedIdx ${destroyedIdx} isn't`
    )
  );

  const removedArr = MathUtils.combinations_lazy_array_with_duplicates(
    PILLAGE_TOKENS,
    destroyed.length
  );

  return $(
    // First we need to find the removed tokens by looking at that part of the
    // index
    pillageTokensIdx % removedArr.length,
    ($$) => removedArr.at($$),
    $.nullthrows(`removedIdx is out of range`),

    // Then we remove them from the rest of the tokens
    ($$) => Vec.diff(PILLAGE_TOKENS, $$),

    // And calculate the order of the rest
    ($$) => MathUtils.permutations_lazy_array($$),
    ($$) => $$.at(Math.floor(pillageTokensIdx / removedArr.length)),
    $.nullthrows(`PermsIdx is out of range`),

    // Finally, we build the output array, putting nulls where the destroyed
    // provinces are in the order, assuming that the rest of the values are
    // parsed clockwise around the board starting at position 0.
    ($$) => [...$$],
    ($$) =>
      Vec.map(Vec.range(0, 7), (position) =>
        destroyed.includes(Provinces.atPosition(position)) ? null : $$.pop()!
      )
  );
}

function gridIndexToPosition(idx: number): number | undefined {
  switch (idx) {
    case 0:
    case 1:
    case 2:
      return idx;

    case 3:
      return 7;
    case 5:
      return 3;

    case 6:
    case 7:
    case 8:
      return 12 - idx;

    default:
      return;
  }
}

function label(token: PillageTokenType | null): string {
  switch (token) {
    case "axe":
      return "Axe";
    case "glory":
      return "5 Glory";
    case "horn":
      return "Horn";
    case "rage":
      return "Rage";
    case null:
      return "🔥";
  }
}
