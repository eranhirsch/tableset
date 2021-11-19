import { Grid, Paper, Typography } from "@mui/material";
import { Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHash } from "games/core/ux/IndexHash";
import { isIndexType } from "games/global/coercers/isIndexType";
import { useMemo } from "react";
import { HexType, HEX_TYPE_LABEL } from "../utils/HexType";
import { ModularMapTiles } from "../utils/ModularMapTiles";
import modularBoardVariant from "./modularBoardVariant";

export default createRandomGameStep({
  id: "mapTiles",
  labelOverride: "Modular: Map Tiles",

  isType: isIndexType,

  dependencies: [modularBoardVariant],

  isTemplatable: (modular) => modular.canResolveTo(true),

  resolve: (_, isModular) => (isModular ? ModularMapTiles.randomIdx() : null),

  skip: (_, [isModular]) => !isModular,

  ...NoConfigPanel,

  InstanceVariableComponent,
  InstanceManualComponent,
});

function InstanceVariableComponent({
  value: tilesIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const tiles = useMemo(() => ModularMapTiles.decode(tilesIdx), [tilesIdx]);

  return (
    <>
      <Typography variant="body1">
        Place the following map tiles on the board:
      </Typography>
      <Grid container gap={1} padding={1}>
        {Vec.map(tiles, (tile, pos) => (
          <Tile key={`tile_${pos}`} corner={tile[0][0]} center={tile[1][1]} />
        ))}
      </Grid>
      <IndexHash idx={tilesIdx} />
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

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Lay out the map:">
      <BlockWithFootnotes
        footnote={
          <>4 cardboard tiles made of 7 hexes each, printed on both sides.</>
        }
      >
        {(Footnote) => (
          <>
            Shuffle all map tiles
            <Footnote />, also randomly determining each tile's side.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Place a map tile on each of the <em>4 quadrants</em> of the map,
        aligning it's graphics with the graphics on the board.
      </>
      <>
        For any tile that has a <em>{HEX_TYPE_LABEL.lake}</em> adjacent to a{" "}
        <strong>home base</strong>, flip that tile to it's other side.
      </>
    </HeaderAndSteps>
  );
}