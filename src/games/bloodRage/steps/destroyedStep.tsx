import { Stack, Typography } from "@mui/material";
import { $, MathUtils, nullthrows, Random, Vec } from "common";
import { CombinationsLazyArray } from "common/standard_library/math/combinationsLazyArray";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { playersMetaStep } from "games/global";
import { useMemo } from "react";
import { ProvinceId, Provinces } from "../utils/Provinces";
import { Ragnarok } from "../utils/Ragnarok";
import ragnarokStep from "./ragnarokStep";

export default createRandomGameStep({
  id: "destroyed",
  dependencies: [playersMetaStep, ragnarokStep],
  isTemplatable: (_, ragnarok) => ragnarok.willResolve(),

  resolve: (_, playerIds, ragnarokIdx) =>
    ragnarokIdx != null
      ? Random.index(combinationsArray(ragnarokIdx, playerIds!.length))
      : null,

  InstanceVariableComponent,
  InstanceCards: (props) => (
    <IndexHashInstanceCard {...props} title="Destroyed" />
  ),

  instanceAvroType: "int",
  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: destroyedIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const ragnarokIdx = useRequiredInstanceValue(ragnarokStep);

  const destroyed = useMemo(() => {
    return nullthrows(
      combinationsArray(ragnarokIdx, playerIds.length).at(destroyedIdx),
      `Index ${destroyedIdx} is out of range`
    );
  }, [destroyedIdx, playerIds.length, ragnarokIdx]);

  return (
    <>
      <Typography variant="body1">
        Before the game begins, some provinces will already have been destroyed
        by Ragnarök, leaving less usable space on the board. Place the following{" "}
        <ChosenElement>
          Ragnarok Token{destroyed.length > 1 && "s"}
        </ChosenElement>{" "}
        on the province{destroyed.length > 1 && "s"}, with the “destroyed” side
        facing up.
      </Typography>
      <Stack direction="column" spacing={1} textAlign="center" marginY={2}>
        {Vec.map(destroyed, (provinceId) => (
          <Typography
            variant="subtitle1"
            sx={{ fontVariantCaps: "small-caps" }}
          >
            <strong>{Provinces.label(provinceId)}</strong>
          </Typography>
        ))}
      </Stack>
      <IndexHashCaption idx={ragnarokIdx} />
    </>
  );
}

const combinationsArray = (
  ragnarokIdx: number,
  playerCount: number
): CombinationsLazyArray<ProvinceId> =>
  $(
    ragnarokIdx,
    Ragnarok.decode,
    ($$) => Vec.diff(Provinces.ids, $$),
    ($$) => MathUtils.combinations_lazy_array($$, 5 - playerCount)
  );
