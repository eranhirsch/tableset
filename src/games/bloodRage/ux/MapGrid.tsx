import { Chip, Grid } from "@mui/material";
import { $, Vec } from "common";
import { GamePiecesColor } from "model/GamePiecesColor";
import React from "react";
import { ProvinceId, Provinces } from "../utils/Provinces";

export function MapGrid({
  color,
  label,
}: {
  color(
    provinceId: ProvinceId,
    position: number
  ): GamePiecesColor | undefined | "primary";
  label(
    provinceId: ProvinceId,
    position: number
  ): JSX.Element | string | undefined;
}): JSX.Element {
  return (
    <Grid container spacing={1} maxWidth="100%" paddingRight={1} marginY={2}>
      {$(
        Vec.range(0, 8),
        ($$) =>
          Vec.map($$, (gridIdx) => (
            <Grid item xs={4}>
              <MapRegion gridIdx={gridIdx} color={color} label={label} />
            </Grid>
          )),
        React.Children.toArray
      )}
    </Grid>
  );
}

function MapRegion({
  gridIdx,
  color,
  label,
}: {
  gridIdx: number;
  color(
    provinceId: ProvinceId,
    position: number
  ): GamePiecesColor | undefined | "primary";
  label(provinceId: ProvinceId, position: number): React.ReactNode | undefined;
}): JSX.Element {
  const pos = gridIndexToPosition(gridIdx);

  if (pos == null) {
    return (
      <Chip sx={{ width: "100%" }} color="green" label={<em>Yggdrasil</em>} />
    );
  }

  const provinceIdAtPos = Provinces.atPosition(pos);
  return (
    <Chip
      sx={{ width: "100%" }}
      color={color(provinceIdAtPos, pos)}
      label={label(provinceIdAtPos, pos)}
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
