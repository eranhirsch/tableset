import { Typography } from "@mui/material";
import { ChosenElement } from "games/core/ux/ChosenElement";
import createFirstPlayerStep from "games/global/steps/createFirstPlayerStep";

export default createFirstPlayerStep({
  InstanceManualComponent: () => (
    <Typography variant="body1">
      The <ChosenElement>first player</ChosenElement> is the player who was born
      furthest to the north.
    </Typography>
  ),

  FirstPlayerToken: () => (
    <>
      <ChosenElement>First Player token</ChosenElement>.{" "}
      <em>
        The First Player token will be passed to the player to the left at the
        end of each Age
      </em>
      .
    </>
  ),
});
