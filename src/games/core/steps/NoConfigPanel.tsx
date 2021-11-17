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
    <Typography paddingX={2} variant="body2" textAlign="center">
      <em>(No settings).</em>
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
