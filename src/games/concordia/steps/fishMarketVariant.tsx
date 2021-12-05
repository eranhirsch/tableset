import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "fishMarket",
  name: "Fish Market",
  dependencies: [productsMetaStep],
  isTemplatable: (products) =>
    products.willContainAny(["balearicaCyprus", "balearicaItalia"]),
  Description: InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Fish, replacing the province's bonus resources, could be used a the start
      of a player's turn at the Fish Market in order to gain additional
      resources, actions, or sestertii.
    </Typography>
  );
}
