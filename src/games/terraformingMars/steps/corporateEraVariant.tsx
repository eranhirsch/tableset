import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import { playersMetaStep } from "games/global";

export default createVariant({
  id: "corporateEra",
  name: "Corporate Era",
  dependencies: [playersMetaStep],
  isTemplatable: (players) =>
    // CorporateEra is always used with solo play
    players.onlyResolvableValue()!.length > 1,
  Description,
});

function Description(): JSX.Element {
  return (
    <Typography variant="body1" textAlign="justify">
      Corporate Era focuses on economy and technology. These are projects that
      do not contribute directly to the terraforming, but make the corporations
      stronger, adding new strategic choices to the game.
      <br />
      Playing Corporate Era makes the game longer and more complex. We do not
      recommend it for players new to Terraforming Mars.
    </Typography>
  );
}
