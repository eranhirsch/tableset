import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "resolution",
  name: "Resolution",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("windGambit")!,
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      The game doesn't end immediately when the 6th star is achieved; instead, a
      random end-game trigger is chosen, which also provides new ways to achieve
      stars, gain money, or otherwise break the rules of the game.
    </Typography>
  );
}
