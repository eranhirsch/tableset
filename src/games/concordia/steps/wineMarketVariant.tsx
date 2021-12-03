import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import { RESOURCE_NAME } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";
import productsMetaStep from "./productsMetaStep";
import saltVariantStep from "./saltVariant";

export default createVariant({
  id: "wineMarket",
  name: "Prices in Wine (Cards Market)",
  dependencies: [productsMetaStep],
  conditional: saltVariantStep,
  isTemplatable: (products) =>
    products.willContainAny(["aegyptusCreta", "venus", "venusBase"]),
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Cards bought via a <RomanTitle>Senator</RomanTitle> now cost{" "}
      <strong>{RESOURCE_NAME.wine}</strong> as an additional resource, and not
      just {RESOURCE_NAME.cloth}.
    </Typography>
  );
}
