import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "airship",
  name: "Airship",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("windGambit")!,
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Players have a unit of a new type with dynamic rules for movement,
      attacking, and unique abilities.
    </Typography>
  );
}
