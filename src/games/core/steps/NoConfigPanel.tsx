import { Typography } from "@mui/material";
import { templateValue } from "features/template/templateSlice";

/**
 * Spread this helper trait to fill in some of the required props in the
 * `RandomGameStep` options object when you don't need a config panel at all.
 */
export const NoConfigPanel = {
  ConfigPanel,
  ConfigPanelTLDR,
  initialConfig,
  refresh,
} as const;

function ConfigPanel(): JSX.Element {
  return (
    <Typography variant="body2">
      A value would be determined at random, there are no settings for this
      step.
    </Typography>
  );
}

function ConfigPanelTLDR(): JSX.Element {
  return <>Random</>;
}

function initialConfig(): true {
  return true;
}

function refresh(): never {
  templateValue("unchanged");
}
