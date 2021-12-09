import { Chip, Grid, Typography } from "@mui/material";
import { $, Random, Vec } from "common";
import { useOptionalInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { playersMetaStep } from "games/global";
import React from "react";
import { Destroyed } from "../utils/Destroyed";
import { Gods } from "../utils/Gods";
import { ProvinceId, Provinces } from "../utils/Provinces";
import { Ragnarok } from "../utils/Ragnarok";
import destroyedStep from "./destroyedStep";
import godsSelectionStep from "./godsSelectionStep";
import godsVariant from "./godsVariant";
import ragnarokStep from "./ragnarokStep";

export default createRandomGameStep({
  id: "godsLocation",
  dependencies: [playersMetaStep, godsVariant, ragnarokStep, destroyedStep],

  isTemplatable: (_, isEnabled, ragnarok, destroyed) =>
    isEnabled && ragnarok.willResolve() && destroyed.willResolve(),

  resolve: (_, playerIds, isEnabled, ragnarokIdx, destroyedIdx) =>
    isEnabled
      ? $(
          Provinces.ids,
          ($$) => Vec.diff($$, Ragnarok.decode(ragnarokIdx!)),
          ($$) =>
            Vec.diff(
              $$,
              Destroyed.decode(destroyedIdx!, playerIds!.length, ragnarokIdx!)
            ),
          ($$) => Random.sample($$, Gods.PER_GAME),
          Random.shuffle
        )
      : null,
  skip: (_value, [_playerIds, isEnabled]) => !isEnabled,

  instanceAvroType: { type: "array", items: Provinces.avroType },

  InstanceVariableComponent,

  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: godProvinceIds,
}: VariableStepInstanceComponentProps<readonly ProvinceId[]>): JSX.Element {
  return (
    <>
      <Typography variant="body1">
        Take the <ChosenElement>god figure</ChosenElement> corresponding to the
        cards drawn to place them in their starting provinces;{" "}
        <em>
          the god figures never occupy any villages; they are simply placed
          inside the indicated province area
        </em>
        .
      </Typography>
      <Grid container spacing={1} maxWidth="100%" paddingRight={1} marginY={2}>
        {$(
          Vec.range(0, 8),
          ($$) =>
            Vec.map($$, (gridIdx) => (
              <Grid item xs={4}>
                <MapRegion gridIdx={gridIdx} godProvinceIds={godProvinceIds} />
              </Grid>
            )),
          React.Children.toArray
        )}
      </Grid>
    </>
  );
}

function MapRegion({
  gridIdx,
  godProvinceIds,
}: {
  gridIdx: number;
  godProvinceIds: readonly ProvinceId[];
}): JSX.Element {
  const godIds = useOptionalInstanceValue(godsSelectionStep);

  const pos = gridIndexToPosition(gridIdx);

  if (pos == null) {
    return (
      <Chip sx={{ width: "100%" }} color="green" label={<em>Yggdrasil</em>} />
    );
  }

  const provinceIdAtPos = Provinces.atPosition(pos);
  const godIdx = godProvinceIds.indexOf(provinceIdAtPos);
  return (
    <Chip
      sx={{ width: "100%" }}
      color={
        godIdx < 0
          ? undefined
          : godIds != null
          ? Gods.color(godIds[godIdx])
          : "primary"
      }
      label={
        godIdx < 0
          ? undefined
          : godIds != null
          ? Gods.label(godIds[godIdx])
          : Provinces.label(provinceIdAtPos)
      }
    />
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
