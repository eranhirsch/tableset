import { Typography } from "@mui/material";
import React from "react";

export function NoSettingsConfigPanel(): JSX.Element {
  return (
    <Typography variant="body2">
      A value would be determined at random, there are no settings for this
      step.
    </Typography>
  );
}

export function NoSettingsConfigPanelTLDR(): JSX.Element {
  return <>Random</>;
}
