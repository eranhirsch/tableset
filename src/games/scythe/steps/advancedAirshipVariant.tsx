import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import airshipVariant from "./airshipVariant";

export default createVariant({
  id: "playerAirship",
  name: "Airship: Per Player",
  dependencies: [airshipVariant],
  isTemplatable: (airship) => airship.canResolveTo(true),
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Instead of shared global abilities for airships, each player get's their
      own aggressive and passive tiles.
    </Typography>
  );
}
