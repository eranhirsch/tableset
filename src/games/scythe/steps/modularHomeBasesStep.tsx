import { Box, Chip, Stack, Typography } from "@mui/material";
import { Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { useMemo } from "react";
import { Factions } from "../utils/Factions";
import { HomeBases } from "../utils/HomeBases";
import modularBoardVariant from "./modularBoardVariant";

export default createRandomGameStep({
  id: "homeBases",

  labelOverride: "Modular: Home Bases",

  dependencies: [modularBoardVariant],

  isTemplatable: (modular) => modular.canResolveTo(true),

  resolve: (_, isModular) => (isModular ? HomeBases.randomHash() : null),

  skip: (_, [isModular]) => !isModular,

  ...NoConfigPanel,

  InstanceVariableComponent,
  InstanceManualComponent,
});

function InstanceVariableComponent({
  value: basesHash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  const perm = useMemo(() => HomeBases.decode(basesHash), [basesHash]);

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

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Assign a home base for each faction:">
      <BlockWithFootnotes
        footnote={
          <>
            Cardboard discs with faction logos on one side and a tent on the the
            other side. One of the discs depicts a tent on the other side too,
            this is for the empty home base.
          </>
        }
      >
        {(Footnote) => (
          <>
            Flip all home-base tiles
            <Footnote /> so their faction side is hidden.
          </>
        )}
      </BlockWithFootnotes>
      <>Shuffle the tiles.</>
      <BlockWithFootnotes
        footnote={
          <>A encircled tent, inside a hex, on the perimeter of the map.</>
        }
      >
        {(Footnote) => (
          <>
            Randomly put a tile on each home-base space on the board
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Flip the tiles so that their faction side is showing;{" "}
        <em>
          one tile would show a tent, this is an empty home-base that isn't used
          by any faction
        </em>
        .
      </>
    </HeaderAndSteps>
  );
}
