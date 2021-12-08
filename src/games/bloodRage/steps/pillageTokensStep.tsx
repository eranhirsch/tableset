import { Chip, Grid, Typography } from "@mui/material";
import { MathUtils, nullthrows, Random } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { useMemo } from "react";
import { Provinces } from "../utils/Provinces";

const ALL_PILLAGE_TOKEN_TYPES = ["rage", "axe", "horn", "glory"] as const;
type PillageTokenType = typeof ALL_PILLAGE_TOKEN_TYPES[number];
const PILLAGE_TOKENS: Readonly<Required<Record<PillageTokenType, number>>> = {
  axe: 2,
  glory: 1,
  horn: 2,
  rage: 3,
};

export default createRandomGameStep({
  id: "pillageTokens",
  dependencies: [],
  isTemplatable: () => true,

  resolve: () =>
    Random.index(MathUtils.permutations_lazy_array(PILLAGE_TOKENS)),

  InstanceVariableComponent,
  InstanceCards: (props) => (
    <IndexHashInstanceCard {...props} title="Pillage Tokens" />
  ),

  instanceAvroType: "int",
  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: permIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const tokens = useMemo(
    () =>
      nullthrows(
        MathUtils.permutations_lazy_array(PILLAGE_TOKENS).at(permIdx),
        `Index ${permIdx} is out of range`
      ),
    [permIdx]
  );
  return (
    <>
      <Typography variant="body1">
        Put the following <ChosenElement>Pillage Token</ChosenElement> with the
        reward side facing up in each province:
      </Typography>
      <Grid container spacing={1} maxWidth="100%" paddingRight={1} marginY={2}>
        <Grid item xs={4}>
          <Chip
            sx={{ width: "100%" }}
            color={Provinces.color("myrkulor")}
            label={label(tokens[0])}
          />
        </Grid>
        <Grid item xs={4}>
          <Chip
            sx={{ width: "100%" }}
            color={Provinces.color("eluagar")}
            label={label(tokens[1])}
          />
        </Grid>
        <Grid item xs={4}>
          <Chip
            sx={{ width: "100%" }}
            color={Provinces.color("angerboda")}
            label={label(tokens[2])}
          />
        </Grid>
        <Grid item xs={4}>
          <Chip
            sx={{ width: "100%" }}
            color={Provinces.color("gimle")}
            label={label(tokens[7])}
          />
        </Grid>
        <Grid item xs={4}>
          <Chip
            sx={{ width: "100%" }}
            color="green"
            label={<strong>Yggdrasil</strong>}
          />
        </Grid>
        <Grid item xs={4}>
          <Chip
            sx={{ width: "100%" }}
            color={Provinces.color("muspelheim")}
            label={label(tokens[3])}
          />
        </Grid>
        <Grid item xs={4}>
          <Chip
            sx={{ width: "100%" }}
            color={Provinces.color("anolang")}
            label={label(tokens[6])}
          />
        </Grid>
        <Grid item xs={4}>
          <Chip
            sx={{ width: "100%" }}
            color={Provinces.color("utgard")}
            label={label(tokens[5])}
          />
        </Grid>
        <Grid item xs={4}>
          <Chip
            sx={{ width: "100%" }}
            color={Provinces.color("horgr")}
            label={label(tokens[4])}
          />
        </Grid>
      </Grid>
      <IndexHashCaption idx={permIdx} />
    </>
  );
}

function label(token: PillageTokenType): string {
  switch (token) {
    case "axe":
      return "Axe";
    case "glory":
      return "5 Glory";
    case "horn":
      return "Horn";
    case "rage":
      return "Rage";
  }
}
