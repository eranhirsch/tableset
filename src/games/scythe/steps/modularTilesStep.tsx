import { Grid, Paper, Typography } from "@mui/material";
import { Random, Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { HexType, HEX_TYPE_LABEL } from "../utils/HexType";
import { ModularTiles } from "../utils/ModularTiles";
import modularBoardVariant from "./modularBoardVariant";

export default createRandomGameStep({
  id: "modularTiles",
  dependencies: [modularBoardVariant],

  isTemplatable: (modular) => modular.canResolveTo(true),

  resolve(isModular) {
    if (!isModular) {
      return null;
    }

    const { tiles, encode } = ModularTiles;

    const order = Random.shuffle(Vec.range(0, tiles.length - 1));
    const sides = Vec.map(order, (tileIdx, position) =>
      Random.coin_flip(0.5) && tiles[tileIdx][0].illegalLocation !== position
        ? 0
        : 1
    );

    return encode(order, sides);
  },

  ...NoConfigPanel,

  InstanceVariableComponent,
});

function InstanceVariableComponent({
  value: tilesIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const [order, sides] = ModularTiles.decode(tilesIdx);
  const tiles = Vec.map(
    order,
    (tileIdx, position) => ModularTiles.tiles[tileIdx][sides[position]]
  );

  return (
    <>
      <Typography variant="body1">
        Place the following modular tiles on the board:
      </Typography>
      <Grid container gap={1} padding={1}>
        {Vec.map(tiles, ({ center, corner }, pos) => (
          <Tile key={`tile_${pos}`} corner={corner} center={center} />
        ))}
      </Grid>
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

