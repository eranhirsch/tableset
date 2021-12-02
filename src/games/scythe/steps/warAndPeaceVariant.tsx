import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "warPeaceTriumphTrack",
  name: "Triumph Track",

  dependencies: [productsMetaStep],

  isTemplatable: (products) => products.willContain("fenris")!,

  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Replaces the regular triumph track with either a track emphasizing
      military force, or one discouraging battles.
    </Typography>
  );
}
