import { Chip, Grid, Stack, Typography } from "@mui/material";
import { $, Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import React, { useMemo } from "react";
import { ProvinceId, Provinces } from "../utils/Provinces";
import { Ragnarok } from "../utils/Ragnarok";

export default createRandomGameStep({
  id: "ragnarok",
  dependencies: [],
  isTemplatable: () => true,

  resolve: Ragnarok.randomIdx,

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards: (props) => (
    <IndexHashInstanceCard {...props} title="Ragnarok" />
  ),

  instanceAvroType: "int",
  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: ragnarokIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const ragnarokOrder = useMemo(
    () => Ragnarok.decode(ragnarokIdx),
    [ragnarokIdx]
  );
  return (
    <>
      <Typography variant="body1">
        Put the following <ChosenElement>Ragnarok Token</ChosenElement> text
        side facing on each of the three Ragnarök spots on the Age Track:
      </Typography>
      <Stack direction="column" spacing={1} textAlign="center" marginY={2}>
        {Vec.map(ragnarokOrder, (provinceId) => (
          <Typography
            variant="subtitle1"
            sx={{ fontVariantCaps: "small-caps" }}
          >
            <strong>{Provinces.label(provinceId)}</strong>
          </Typography>
        ))}
      </Stack>
      <Grid container spacing={1} maxWidth="100%" paddingRight={1} marginY={2}>
        {$(
          Vec.range(0, 8),
          ($$) =>
            Vec.map($$, (gridIdx) => (
              <Grid item xs={4}>
                <MapRegion gridIdx={gridIdx} ragnarokOrder={ragnarokOrder} />
              </Grid>
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
  ragnarokOrder,
}: {
  gridIdx: number;
  ragnarokOrder: readonly ProvinceId[];
}): JSX.Element {
  const pos = gridIndexToPosition(gridIdx);

  if (pos == null) {
    return (
      <Chip sx={{ width: "100%" }} color="green" label={<em>Yggdrasil</em>} />
    );
  }

  const provinceIdAtPos = Provinces.atPosition(pos);
  const age = ragnarokOrder.indexOf(provinceIdAtPos);
  return (
    <Chip
      sx={{ width: "100%" }}
      color={age >= 0 ? "red" : undefined}
      label={age >= 0 ? <strong>Age {age + 1}</strong> : undefined}
    />
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps>
      <>
        Take the <strong>8</strong>{" "}
        <ChosenElement>Ragnarök tokens</ChosenElement>.
      </>
      <>Flip them on the side where the province name is hidden.</>
      <>Shuffle them.</>
      <>
        Place one on each of the <strong>3</strong> Ragnarök spots on the{" "}
        <ChosenElement>Age Track</ChosenElement>. The tokens should have the
        text side facing up,{" "}
        <em>
          indicating what provinces will be destroyed in the course of the game
        </em>
        .
      </>
    </HeaderAndSteps>
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
