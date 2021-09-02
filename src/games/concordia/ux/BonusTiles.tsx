import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { ProvinceResourceMapping } from "../steps/bonusTilesStep";

export default function BonusTiles({
  provinceResource,
}: {
  provinceResource: ProvinceResourceMapping;
}) {
  return (
    <Grid container>
      {Object.entries(provinceResource).map(([provinceName, resource]) => (
        <React.Fragment key={provinceName}>
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontVariantCaps: "petite-caps" }}
            >
              {provinceName}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">{resource}</Typography>
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
}
