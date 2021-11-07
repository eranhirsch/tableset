import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "modularBoard",
  name: "Modular Board",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("modularBoard")!,
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Instead of playing on the regular board, a board with interchangeable map
      parts is used to generate a random layout, and with random home base
      locations.
    </Typography>
  );
}
