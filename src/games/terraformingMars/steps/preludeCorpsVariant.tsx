import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import preludeVariant from "./preludeVariant";
import venusCorpsVariant from "./venusCorpsVariant";

export default createVariant({
  id: "preludeCorps",
  name: "Prelude: Corporations",
  dependencies: [preludeVariant],
  isTemplatable: (isPrelude) => isPrelude.canResolveTo(true),
  incompatibleWith: venusCorpsVariant,
  Description: () => (
    <Typography variant="body1">
      Always have a choice of a <em>Prelude</em> corporation to chose from.
    </Typography>
  ),
});
