import { Grid, Typography } from "@mui/material";
import { $, MathUtils, nullthrows, Random, Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import React, { useMemo } from "react";
import { ALL_REGION_IDS, REGION_NAME } from "../utils/Regions";

export default createRandomGameStep({
  id: "regionCards",
  dependencies: [],
  isTemplatable: () => true,
  resolve: () =>
    $(
      ALL_REGION_IDS.length,
      MathUtils.factorial,
      ($$) => Number($$),
      ($$) => Random.int($$)
    ),

  InstanceVariableComponent,
  InstanceCards: (props) => (
    <IndexHashInstanceCard title="Regions" {...props} />
  ),
  InstanceManualComponent:
    "Shuffle the region cards and deal one face up next to each numbered space on the board.",
  ...NoConfigPanel,
  instanceAvroType: "int",
});

function InstanceVariableComponent({
  value: regionsIndex,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const regions = useMemo(
    () =>
      nullthrows(
        MathUtils.permutations_lazy_array(ALL_REGION_IDS).at(regionsIndex),
        `Index ${regionsIndex} out of range`
      ),
    [regionsIndex]
  );

  const pivot = regions.length / 2;

  return (
    <>
      <Typography variant="body1">
        Place the following region cards in the matching spaces around the
        board:
      </Typography>
      <Grid container marginY={2} paddingX={2} columnSpacing={4}>
        {Vec.map(Vec.range(0, pivot - 1), (idx) => (
          <React.Fragment key={`regions_${idx}_${idx + pivot}`}>
            <Grid item xs={6} textAlign="right">
              <strong>{REGION_NAME[regions[idx]]}</strong> {idx + 1}
            </Grid>
            <Grid item xs={6} textAlign="left">
              {idx + pivot + 1}{" "}
              <strong>{REGION_NAME[regions[idx + pivot]]}</strong>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <IndexHashCaption idx={regionsIndex} />
    </>
  );
}
