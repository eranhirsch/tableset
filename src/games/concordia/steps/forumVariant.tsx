import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "forum",
  name: "Forum",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("salsa")!,
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Forum tiles provide players with unique abilities to <em>break</em> the
      rules of the game.
    </Typography>
  );
}
