import { Typography } from "@mui/material";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import venusVariant from "./venusVariant";

export default createDerivedGameStep({
  id: "venusBoard",
  labelOverride: "Venus: Board",
  dependencies: [venusVariant],
  skip: ([isVenus]) => !isVenus,
  InstanceDerivedComponent: () => (
    <Typography variant="body1" textAlign="justify">
      Place the <ChosenElement extraInfo="board">Venus</ChosenElement> next to
      the game board.
    </Typography>
  ),
});
