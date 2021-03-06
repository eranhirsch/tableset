import { Typography } from "@mui/material";
import { $, MathUtils, Random, Vec } from "common";
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
import React, { useMemo } from "react";
import { ProvinceId, Provinces } from "../utils/Provinces";
import { MapGrid } from "../ux/MapGrid";
import destroyedStep, { destroyedPerPlayerCount } from "./destroyedStep";

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
  dependencies: [destroyedStep],
  isTemplatable: () => true,

  resolve: (_, destroyedProvinceIds) => resolve(destroyedProvinceIds),

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards: (props) => (
    <IndexHashInstanceCard {...props} title="Pillage Tokens" />
  ),

  instanceAvroType: "int",
  ...NoConfigPanel,
});

function resolve(destroyedProvinceIds: readonly ProvinceId[] | null): number {
  if (destroyedProvinceIds == null) {
    return Random.index(MathUtils.permutations_lazy_array(PILLAGE_TOKENS));
  }

  // We need to remove tokens because of the destroyed provinces which won't
  // need a token any more.
  const removedTokens = Random.sample(
    PILLAGE_TOKENS,
    destroyedProvinceIds.length
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
  const destroyedProvinceIds = useOptionalInstanceValue(destroyedStep);

  const tokens = useMemo(
    () => decode(pillageTokenIdx, destroyedProvinceIds),
    [destroyedProvinceIds, pillageTokenIdx]
  );

  return (
    <>
      <Typography variant="body1">
        Put the following <ChosenElement>Pillage Token</ChosenElement> with the
        reward side facing up in each province:
      </Typography>
      <MapGrid
        color={(provinceId, pos) =>
          tokens[pos] == null ? "red" : Provinces.color(provinceId)
        }
        label={(_, pos) => <strong>{label(tokens[pos])}</strong>}
      />
      <IndexHashCaption idx={pillageTokenIdx} />
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const destroyedProvinceIds = useOptionalInstanceValue(destroyedStep);

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
        {destroyedProvinceIds != null
          ? !Vec.is_empty(destroyedProvinceIds) && (
              <>
                , skipping{" "}
                <GrammaticalList>
                  {React.Children.toArray(
                    Vec.map(destroyedProvinceIds, (pid) => (
                      <em>{Provinces.label(pid)}</em>
                    ))
                  )}
                </GrammaticalList>
              </>
            )
          : destroyedPerPlayerCount(playerIds.length) > 0 && (
              <>
                , skipping the{" "}
                <strong>{destroyedPerPlayerCount(playerIds.length)}</strong>{" "}
                destroyed provinces
              </>
            )}
        .
      </>
      {(destroyedProvinceIds != null
        ? !Vec.is_empty(destroyedProvinceIds) && (
            <>
              You should have <strong>{destroyedProvinceIds.length}</strong>{" "}
              tokens remaining.
            </>
          )
        : destroyedPerPlayerCount(playerIds.length) > 0) && (
        <>
          You should have{" "}
          <strong>{destroyedPerPlayerCount(playerIds.length)}</strong> tokens
          remaining.
        </>
      )}
    </HeaderAndSteps>
  );
}

function decode(
  pillageTokensIdx: number,
  destroyedProvinceIds: readonly ProvinceId[] | null
): readonly (PillageTokenType | null)[] {
  if (destroyedProvinceIds == null) {
    return $(
      PILLAGE_TOKENS,
      ($$) => MathUtils.permutations_lazy_array($$),
      ($$) => $$.at(pillageTokensIdx),
      $.nullthrows(`Index ${pillageTokensIdx} is out of range`)
    );
  }

  const removedArr = MathUtils.combinations_lazy_array_with_duplicates(
    PILLAGE_TOKENS,
    destroyedProvinceIds.length
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
        destroyedProvinceIds.includes(Provinces.atPosition(position))
          ? null
          : $$.pop()!
      )
  );
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
      return "????";
  }
}
