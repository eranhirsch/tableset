import { Typography } from "@mui/material";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";

export default createDerivedGameStep({
  id: "map",
  dependencies: [],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Place the board at the center of the table.
    </Typography>
  );
}
