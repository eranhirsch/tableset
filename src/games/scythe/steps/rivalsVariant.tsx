import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";
import warAndPeaceVariant from "./warAndPeaceVariant";

export default createVariant({
  id: "rivals",
  name: "Rivals",
  dependencies: [productsMetaStep],
  conditional: warAndPeaceVariant,
  isTemplatable: (products) => products.willContain("fenris")!,
  Description: InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    // Copied from the manual, p. 51
    <Typography variant="body1">
      Rivals is designed to be used with the War Triumph Track, but it can be
      used without it if you want slightly more focus on combat.
    </Typography>
  );
}
