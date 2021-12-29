import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import coloniesVariant from "./coloniesVariant";
import preludeCorpsVariant from "./preludeCorpsVariant";

export default createVariant({
  id: "coloniesCorps",
  name: "Colonies: Corporations",
  dependencies: [coloniesVariant],
  isTemplatable: (isColonies) => isColonies.canResolveTo(true),
  // TODO: It's not trivial to implement the dependency that either Venus,
  // Prelude, OR(!!!) Colonies would be enabled here as that requires the steps
  // to know details about the implementation of the other steps. For now this
  // would simply be somewhat broken.
  // The code in `corporationsStep` tries to fix some of the problems by giving
  // priority to the Venus variant.
  incompatibleWith: preludeCorpsVariant,
  Description: () => (
    <Typography variant="body1">
      Always have a choice of a <em>Colonies</em> corporation to chose from.
    </Typography>
  ),
});
