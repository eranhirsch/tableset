import { Typography } from "@mui/material";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import europeanBirdsVariant from "./europeanBirdsVariant";

export default createDerivedGameStep({
  id: "europeReferenceTile",
  labelOverride: "Europe: Reference Tile",
  dependencies: [europeanBirdsVariant],
  skip: ([isEurope]) => !isEurope,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <Typography variant="body1" textAlign="justify">
      Place the <ChosenElement extraInfo="tile">reference</ChosenElement> near
      the goal mat.
    </Typography>
  );
}
