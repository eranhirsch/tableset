import { Chip, Grid, Typography } from "@mui/material";
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
import React, { useMemo } from "react";
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
      <Grid container spacing={1} maxWidth="100%" paddingRight={1} marginY={2}>
        {$(
          Vec.range(0, 8),
          ($$) =>
            Vec.map($$, (gridIdx) => (
              <MapRegion gridIdx={gridIdx} destroyed={destroyed} />
            )),
          React.Children.toArray
        )}
      </Grid>
      <IndexHashCaption idx={ragnarokIdx} />
    </>
  );
}

function MapRegion({
  gridIdx,
  destroyed,
}: {
  gridIdx: number;
  destroyed: readonly ProvinceId[];
}): JSX.Element {
  const pos = gridIndexToPosition(gridIdx);

  if (pos == null) {
    return (
      <Grid item xs={4}>
        <Chip
          sx={{ width: "100%" }}
          color="green"
          label={<strong>Yggdrasil</strong>}
        />
      </Grid>
    );
  }

  const provinceAtPos = Provinces.atPosition(pos);
  return (
    <Grid item xs={4}>
      <Chip
        sx={{ width: "100%" }}
        color={destroyed.includes(provinceAtPos) ? "red" : undefined}
        label={
          destroyed.includes(provinceAtPos)
            ? Provinces.label(provinceAtPos)
            : undefined
        }
      />
    </Grid>
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
