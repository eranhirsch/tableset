import { Grid, Paper, Typography } from "@mui/material";
import { Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { HexType, HEX_TYPE_LABEL } from "../utils/HexType";
import { ModularMapTiles } from "../utils/ModularMapTiles";
import modularBoardVariant from "./modularBoardVariant";

export default createRandomGameStep({
  id: "modularTiles",
  dependencies: [modularBoardVariant],

  isTemplatable: (modular) => modular.canResolveTo(true),

  resolve: (_, isModular) => (isModular ? ModularMapTiles.randomHash() : null),

  skip: (_, [isModular]) => !isModular,

  ...NoConfigPanel,

  InstanceVariableComponent,
});

function InstanceVariableComponent({
  value: tilesHash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  const [order, sides] = ModularMapTiles.decode(tilesHash);
  const tiles = Vec.map(
    order,
    (tileIdx, position) => ModularMapTiles.tiles[tileIdx][sides[position]]
  );

  return (
    <>
      <Typography variant="body1">
        Place the following map tiles on the board:
      </Typography>
      <Grid container gap={1} padding={1}>
        {Vec.map(tiles, ({ center, corner }, pos) => (
          <Tile key={`tile_${pos}`} corner={corner} center={center} />
        ))}
      </Grid>
      <Typography variant="caption" sx={{ marginTop: 2 }}>
        <pre>Hash: {tilesHash}</pre>
      </Typography>
    </>
  );
}

function Tile({
  corner,
  center,
}: {
  corner: HexType;
  center: HexType;
}): JSX.Element {
  return (
    <Grid item xs={5}>
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <HexDescription label="top-left" hexType={corner} />
        <HexDescription label="center" hexType={center} />
      </Paper>
    </Grid>
  );
}

function HexDescription({
  label,
  hexType,
}: {
  label: string;
  hexType: HexType;
}): JSX.Element {
  return (
    <span>
      <Typography
        variant="caption"
        fontSize="xx-small"
        sx={{ verticalAlign: "middle" }}
      >
        {label}:{" "}
      </Typography>
      {HEX_TYPE_LABEL[hexType]}
    </span>
  );
}

