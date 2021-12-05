import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "warPeaceTriumphTrack",
  name: "Triumph Track",

  dependencies: [productsMetaStep],

  isTemplatable: (products) => products.willContain("fenris")!,

  Description: InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    // Paraphrased from the Manual, page 51
    <Typography variant="body1">
      Use the <strong>War</strong> Triumph Track if you want to encourage combat
      between players, or use the <strong>Peace</strong> Triumph Track if you
      want to discourage it.
    </Typography>
  );
}
