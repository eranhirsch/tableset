import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "alliances",
  name: "Alliances",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("fenris")!,
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    // Copied from the manual, page 51
    <Typography variant="body1">
      Use Alliances if you want a more formal system of diplomacy than in
      standard Scythe.
    </Typography>
  );
}
