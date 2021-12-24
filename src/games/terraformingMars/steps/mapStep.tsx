import { Typography } from "@mui/material";
import { createGameStep } from "games/core/steps/createGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";

export default createGameStep({
  id: "map",
  InstanceManualComponent: () => (
    <Typography variant="body1" textAlign="justify">
      {/* Copied from the manual verbatim */}
      Place the <ChosenElement>game board</ChosenElement> centrally on the
      table.
    </Typography>
  ),
});
