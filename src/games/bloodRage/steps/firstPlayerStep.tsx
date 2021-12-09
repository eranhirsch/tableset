import { Typography } from "@mui/material";
import { ChosenElement } from "games/core/ux/ChosenElement";
import createFirstPlayerStep from "games/global/steps/createFirstPlayerStep";

export default createFirstPlayerStep({
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      The <ChosenElement>first player</ChosenElement> is the player who was born
      furthest to the north.
    </Typography>
  );
}
