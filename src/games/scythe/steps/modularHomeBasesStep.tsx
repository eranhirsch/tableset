import { Box, Chip, Stack, Typography } from "@mui/material";
import { MathUtils, nullthrows, Num, Random, Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { FactionId, Factions } from "../utils/Factions";
import modularBoardVariant from "./modularBoardVariant";

export default createRandomGameStep({
  id: "homeBases",

  dependencies: [modularBoardVariant],

  isTemplatable: (modular) => modular.canResolveTo(true),

  resolve: () =>
    Num.encode_base32(
      Random.index(MathUtils.permutations_lazy_array(availableHomeBases()))
    ),

  ...NoConfigPanel,

  InstanceVariableComponent,
});

function InstanceVariableComponent({
  value: basesHash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  const perm = nullthrows(
    MathUtils.permutations_lazy_array(availableHomeBases()).at(
      Num.decode_base32(basesHash)
    ),
    `Hash ${basesHash} could not be converted to a permutation`
  );

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="body1">
        Layout the home bases in the following order, starting from the top, and
        going in clockwise order around the board:
      </Typography>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
        gap={1}
      >
        {Vec.map(perm, (fid) =>
          fid === "empty" ? (
            <Chip key={fid} variant="outlined" label="Empty" />
          ) : (
            <Chip
              key={fid}
              color={Factions[fid].color}
              label={Factions[fid].name}
            />
          )
        )}
      </Box>
      <Typography variant="caption" sx={{ marginTop: 2 }}>
        <pre>Hash: {basesHash}</pre>
      </Typography>
    </Stack>
  );
}

const availableHomeBases = (): readonly (FactionId | "empty")[] =>
  Vec.concat(Factions.availableForProducts(["base", "invaders"]), "empty");
