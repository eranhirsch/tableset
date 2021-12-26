import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import venusVariant from "./venusVariant";

export default createVariant({
  id: "venusCorps",
  name: "Venus: Corporations",
  dependencies: [venusVariant],
  isTemplatable: (isVenus) => isVenus.canResolveTo(true),
  Description: () => (
    <Typography variant="body1">
      Always have a choice of a <em>Venus Next</em> corporation to chose from.
    </Typography>
  ),
});
