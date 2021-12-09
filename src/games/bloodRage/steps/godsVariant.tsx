import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "gods",
  name: "Gods",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("gods")!,
  Description,
});

function Description(): JSX.Element {
  return (
    <Typography variant="body1">
      {/* Copied from BoardGameGeek product description */}
      Creates a unique texture to the session. They affect draft choices and
      influence the flow of the battles. They add a whole new layer to the game,
      without adding hardly any complexity to the rules.
    </Typography>
  );
}
